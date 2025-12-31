"""
Token Routes - Invite Token Management
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from bson import ObjectId
from typing import List
import os

from app.core.database import get_database
from app.core.security import generate_invite_token, get_current_admin
from app.schemas.schemas import (
    InviteTokenCreate,
    InviteTokenResponse,
    TokenValidationResponse,
    ProjectResponse
)

router = APIRouter()

# Base URL for invite links - from environment variable
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

@router.post("/generate", response_model=InviteTokenResponse)
async def generate_token(
    token_data: InviteTokenCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Generate a new invite token for a project"""
    db = get_database()
    
    # Verify project exists
    try:
        project = await db.projects.find_one({"_id": ObjectId(token_data.project_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Generate unique token
    invite_token = generate_invite_token()
    
    # Calculate expiration
    expires_at = datetime.utcnow() + timedelta(hours=token_data.expires_hours)
    
    # Create token document
    token_doc = {
        "token": invite_token,
        "project_id": token_data.project_id,
        "status": "active",
        "created_at": datetime.utcnow(),
        "expires_at": expires_at,
        "used_at": None,
        "note": token_data.note,
        "created_by": current_admin["admin_id"]
    }
    
    result = await db.tokens.insert_one(token_doc)
    
    # Generate invite URL
    invite_url = f"{FRONTEND_URL}/review/write?token={invite_token}"
    
    return InviteTokenResponse(
        id=str(result.inserted_id),
        token=invite_token,
        project_id=token_data.project_id,
        project_name=project["name"],
        status="active",
        created_at=token_doc["created_at"],
        expires_at=expires_at,
        used_at=None,
        note=token_data.note,
        invite_url=invite_url
    )

@router.get("/", response_model=List[InviteTokenResponse])
async def get_all_tokens(current_admin: dict = Depends(get_current_admin)):
    """Get all invite tokens"""
    db = get_database()
    
    tokens = []
    cursor = db.tokens.find().sort("created_at", -1)
    
    async for token in cursor:
        # Get project name
        try:
            project = await db.projects.find_one({"_id": ObjectId(token["project_id"])})
            project_name = project["name"] if project else "Deleted Project"
        except:
            project_name = "Unknown Project"
        
        # Check if expired
        status = token["status"]
        if status == "active" and token["expires_at"] < datetime.utcnow():
            status = "expired"
            # Update status in database
            await db.tokens.update_one(
                {"_id": token["_id"]},
                {"$set": {"status": "expired"}}
            )
        
        invite_url = f"{FRONTEND_URL}/review/write?token={token['token']}"
        
        tokens.append(InviteTokenResponse(
            id=str(token["_id"]),
            token=token["token"],
            project_id=token["project_id"],
            project_name=project_name,
            status=status,
            created_at=token["created_at"],
            expires_at=token["expires_at"],
            used_at=token.get("used_at"),
            note=token.get("note"),
            invite_url=invite_url
        ))
    
    return tokens

@router.get("/project/{project_id}", response_model=List[InviteTokenResponse])
async def get_tokens_by_project(
    project_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Get all tokens for a specific project"""
    db = get_database()
    
    # Verify project exists
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    tokens = []
    cursor = db.tokens.find({"project_id": project_id}).sort("created_at", -1)
    
    async for token in cursor:
        status = token["status"]
        if status == "active" and token["expires_at"] < datetime.utcnow():
            status = "expired"
        
        invite_url = f"{FRONTEND_URL}/review/write?token={token['token']}"
        
        tokens.append(InviteTokenResponse(
            id=str(token["_id"]),
            token=token["token"],
            project_id=token["project_id"],
            project_name=project["name"],
            status=status,
            created_at=token["created_at"],
            expires_at=token["expires_at"],
            used_at=token.get("used_at"),
            note=token.get("note"),
            invite_url=invite_url
        ))
    
    return tokens

@router.get("/validate/{token}")
async def validate_token(token: str):
    """Validate an invite token (public endpoint for clients)"""
    db = get_database()
    
    # Find token
    token_doc = await db.tokens.find_one({"token": token})
    
    if not token_doc:
        return TokenValidationResponse(
            valid=False,
            project=None,
            message="Token tidak ditemukan atau tidak valid"
        )
    
    # Check if already used
    if token_doc["status"] == "used":
        return TokenValidationResponse(
            valid=False,
            project=None,
            message="Token sudah digunakan"
        )
    
    # Check if revoked
    if token_doc["status"] == "revoked":
        return TokenValidationResponse(
            valid=False,
            project=None,
            message="Token telah dicabut"
        )
    
    # Check if expired
    if token_doc["expires_at"] < datetime.utcnow():
        # Update status
        await db.tokens.update_one(
            {"_id": token_doc["_id"]},
            {"$set": {"status": "expired"}}
        )
        return TokenValidationResponse(
            valid=False,
            project=None,
            message="Token sudah kedaluwarsa"
        )
    
    # Get project
    try:
        project = await db.projects.find_one({"_id": ObjectId(token_doc["project_id"])})
    except:
        return TokenValidationResponse(
            valid=False,
            project=None,
            message="Project tidak ditemukan"
        )
    
    if not project:
        return TokenValidationResponse(
            valid=False,
            project=None,
            message="Project tidak ditemukan"
        )
    
    return TokenValidationResponse(
        valid=True,
        project=ProjectResponse(
            id=str(project["_id"]),
            name=project["name"],
            description=project.get("description"),
            client_name=project["client_name"],
            client_email=project.get("client_email"),
            client_company=project.get("client_company"),
            project_url=project.get("project_url"),
            project_image=project.get("project_image"),
            tags=project.get("tags", []),
            status=project["status"],
            created_at=project["created_at"],
            updated_at=project["updated_at"]
        ),
        message="Token valid! Silakan tulis testimoni Anda"
    )

@router.delete("/{token_id}")
async def revoke_token(token_id: str, current_admin: dict = Depends(get_current_admin)):
    """Revoke an invite token"""
    db = get_database()
    
    try:
        result = await db.tokens.update_one(
            {"_id": ObjectId(token_id)},
            {"$set": {"status": "revoked"}}
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token ID"
        )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token not found"
        )
    
    return {"message": "Token revoked successfully"}