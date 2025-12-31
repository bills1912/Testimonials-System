"""
Testimonial Routes - Testimonial Management
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

from app.core.database import get_database
from app.core.security import get_current_admin
from app.schemas.schemas import (
    TestimonialCreate,
    TestimonialUpdate,
    TestimonialResponse
)

router = APIRouter()

@router.post("/submit", response_model=TestimonialResponse)
async def submit_testimonial(testimonial_data: TestimonialCreate):
    """Submit a testimonial using an invite token (public endpoint)"""
    db = get_database()
    
    # Validate token
    token_doc = await db.tokens.find_one({"token": testimonial_data.token})
    
    if not token_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token tidak valid atau tidak ditemukan"
        )
    
    if token_doc["status"] == "used":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token sudah digunakan"
        )
    
    if token_doc["status"] == "revoked":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token telah dicabut"
        )
    
    if token_doc["expires_at"] < datetime.utcnow():
        await db.tokens.update_one(
            {"_id": token_doc["_id"]},
            {"$set": {"status": "expired"}}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token sudah kedaluwarsa"
        )
    
    # Get project
    project_id = token_doc["project_id"]
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project tidak ditemukan"
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project tidak ditemukan"
        )
    
    # Create testimonial
    testimonial_doc = {
        "project_id": project_id,
        "token_id": str(token_doc["_id"]),
        "client_name": testimonial_data.client_name,
        "client_role": testimonial_data.client_role,
        "client_company": testimonial_data.client_company,
        "client_avatar": testimonial_data.client_avatar,
        "rating": testimonial_data.rating,
        "title": testimonial_data.title,
        "content": testimonial_data.content,
        "is_featured": testimonial_data.is_featured,
        "is_published": True,  # Auto-publish or set to False for moderation
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.testimonials.insert_one(testimonial_doc)
    
    # Mark token as used
    await db.tokens.update_one(
        {"_id": token_doc["_id"]},
        {
            "$set": {
                "status": "used",
                "used_at": datetime.utcnow()
            }
        }
    )
    
    return TestimonialResponse(
        id=str(result.inserted_id),
        project_id=project_id,
        project_name=project["name"],
        client_name=testimonial_doc["client_name"],
        client_role=testimonial_doc["client_role"],
        client_company=testimonial_doc["client_company"],
        client_avatar=testimonial_doc["client_avatar"],
        rating=testimonial_doc["rating"],
        title=testimonial_doc["title"],
        content=testimonial_doc["content"],
        is_featured=testimonial_doc["is_featured"],
        is_published=testimonial_doc["is_published"],
        created_at=testimonial_doc["created_at"],
        updated_at=testimonial_doc["updated_at"]
    )

@router.get("/", response_model=List[TestimonialResponse])
async def get_all_testimonials(
    project_id: Optional[str] = None,
    featured_only: bool = False,
    current_admin: dict = Depends(get_current_admin)
):
    """Get all testimonials (admin only)"""
    db = get_database()
    
    # Build query
    query = {}
    if project_id:
        query["project_id"] = project_id
    if featured_only:
        query["is_featured"] = True
    
    testimonials = []
    cursor = db.testimonials.find(query).sort("created_at", -1)
    
    async for testimonial in cursor:
        # Get project name
        try:
            project = await db.projects.find_one({"_id": ObjectId(testimonial["project_id"])})
            project_name = project["name"] if project else "Deleted Project"
        except:
            project_name = "Unknown Project"
        
        testimonials.append(TestimonialResponse(
            id=str(testimonial["_id"]),
            project_id=testimonial["project_id"],
            project_name=project_name,
            client_name=testimonial["client_name"],
            client_role=testimonial.get("client_role"),
            client_company=testimonial.get("client_company"),
            client_avatar=testimonial.get("client_avatar"),
            rating=testimonial["rating"],
            title=testimonial["title"],
            content=testimonial["content"],
            is_featured=testimonial.get("is_featured", False),
            is_published=testimonial.get("is_published", True),
            created_at=testimonial["created_at"],
            updated_at=testimonial["updated_at"]
        ))
    
    return testimonials

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial(
    testimonial_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Get a single testimonial by ID"""
    db = get_database()
    
    try:
        testimonial = await db.testimonials.find_one({"_id": ObjectId(testimonial_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid testimonial ID"
        )
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    # Get project name
    try:
        project = await db.projects.find_one({"_id": ObjectId(testimonial["project_id"])})
        project_name = project["name"] if project else "Deleted Project"
    except:
        project_name = "Unknown Project"
    
    return TestimonialResponse(
        id=str(testimonial["_id"]),
        project_id=testimonial["project_id"],
        project_name=project_name,
        client_name=testimonial["client_name"],
        client_role=testimonial.get("client_role"),
        client_company=testimonial.get("client_company"),
        client_avatar=testimonial.get("client_avatar"),
        rating=testimonial["rating"],
        title=testimonial["title"],
        content=testimonial["content"],
        is_featured=testimonial.get("is_featured", False),
        is_published=testimonial.get("is_published", True),
        created_at=testimonial["created_at"],
        updated_at=testimonial["updated_at"]
    )

@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: str,
    testimonial_data: TestimonialUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update a testimonial"""
    db = get_database()
    
    # Build update document
    update_doc = {"updated_at": datetime.utcnow()}
    
    for field, value in testimonial_data.model_dump(exclude_unset=True).items():
        if value is not None:
            update_doc[field] = value
    
    try:
        result = await db.testimonials.update_one(
            {"_id": ObjectId(testimonial_id)},
            {"$set": update_doc}
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid testimonial ID"
        )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    return await get_testimonial(testimonial_id, current_admin)

@router.delete("/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete a testimonial"""
    db = get_database()
    
    try:
        result = await db.testimonials.delete_one({"_id": ObjectId(testimonial_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid testimonial ID"
        )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    return {"message": "Testimonial deleted successfully"}

@router.post("/{testimonial_id}/toggle-featured")
async def toggle_featured(
    testimonial_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Toggle featured status of a testimonial"""
    db = get_database()
    
    try:
        testimonial = await db.testimonials.find_one({"_id": ObjectId(testimonial_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid testimonial ID"
        )
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    new_status = not testimonial.get("is_featured", False)
    
    await db.testimonials.update_one(
        {"_id": ObjectId(testimonial_id)},
        {"$set": {"is_featured": new_status, "updated_at": datetime.utcnow()}}
    )
    
    return {"is_featured": new_status}

@router.post("/{testimonial_id}/toggle-published")
async def toggle_published(
    testimonial_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Toggle published status of a testimonial"""
    db = get_database()
    
    try:
        testimonial = await db.testimonials.find_one({"_id": ObjectId(testimonial_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid testimonial ID"
        )
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    new_status = not testimonial.get("is_published", True)
    
    await db.testimonials.update_one(
        {"_id": ObjectId(testimonial_id)},
        {"$set": {"is_published": new_status, "updated_at": datetime.utcnow()}}
    )
    
    return {"is_published": new_status}
