"""
Admin Routes - Authentication, Dashboard, and Admin Management
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from bson import ObjectId
from typing import List

from app.core.database import get_database
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_admin
)
from app.schemas.schemas import (
    AdminCreate,
    AdminLogin,
    AdminResponse,
    TokenResponse,
    DashboardStats,
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    TestimonialResponse
)

router = APIRouter()

# ============== AUTHENTICATION ==============

@router.post("/register", response_model=TokenResponse)
async def register_admin(admin_data: AdminCreate):
    """Register a new admin account"""
    db = get_database()
    
    # Check if username or email already exists
    existing = await db.admins.find_one({
        "$or": [
            {"username": admin_data.username},
            {"email": admin_data.email}
        ]
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create admin document
    admin_doc = {
        "username": admin_data.username,
        "email": admin_data.email,
        "password_hash": get_password_hash(admin_data.password),
        "full_name": admin_data.full_name,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.admins.insert_one(admin_doc)
    admin_id = str(result.inserted_id)
    
    # Generate access token
    access_token = create_access_token(
        data={"sub": admin_data.username, "admin_id": admin_id}
    )
    
    return TokenResponse(
        access_token=access_token,
        admin=AdminResponse(
            id=admin_id,
            username=admin_data.username,
            email=admin_data.email,
            full_name=admin_data.full_name,
            created_at=admin_doc["created_at"]
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login_admin(login_data: AdminLogin):
    """Login and get access token"""
    db = get_database()
    
    # Find admin by username
    admin = await db.admins.find_one({"username": login_data.username})
    
    if not admin or not verify_password(login_data.password, admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    admin_id = str(admin["_id"])
    
    # Generate access token
    access_token = create_access_token(
        data={"sub": admin["username"], "admin_id": admin_id}
    )
    
    return TokenResponse(
        access_token=access_token,
        admin=AdminResponse(
            id=admin_id,
            username=admin["username"],
            email=admin["email"],
            full_name=admin["full_name"],
            created_at=admin["created_at"]
        )
    )

@router.get("/me", response_model=AdminResponse)
async def get_current_admin_info(current_admin: dict = Depends(get_current_admin)):
    """Get current logged in admin info"""
    db = get_database()
    
    admin = await db.admins.find_one({"username": current_admin["username"]})
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    return AdminResponse(
        id=str(admin["_id"]),
        username=admin["username"],
        email=admin["email"],
        full_name=admin["full_name"],
        created_at=admin["created_at"]
    )

# ============== DASHBOARD ==============

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_admin: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    db = get_database()
    
    # Get counts
    total_projects = await db.projects.count_documents({})
    total_testimonials = await db.testimonials.count_documents({})
    total_tokens = await db.tokens.count_documents({})
    active_tokens = await db.tokens.count_documents({
        "status": "active",
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    # Get average rating
    pipeline = [
        {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
    ]
    rating_result = await db.testimonials.aggregate(pipeline).to_list(1)
    average_rating = rating_result[0]["avg_rating"] if rating_result else 0.0
    
    # Get featured count
    featured_count = await db.testimonials.count_documents({"is_featured": True})
    
    # Get recent testimonials
    recent_cursor = db.testimonials.find().sort("created_at", -1).limit(5)
    recent_testimonials = []
    
    async for testimonial in recent_cursor:
        # Get project name
        project = await db.projects.find_one({"_id": ObjectId(testimonial["project_id"])})
        project_name = project["name"] if project else "Unknown Project"
        
        recent_testimonials.append(TestimonialResponse(
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
    
    return DashboardStats(
        total_projects=total_projects,
        total_testimonials=total_testimonials,
        total_tokens=total_tokens,
        active_tokens=active_tokens,
        average_rating=round(average_rating, 2),
        featured_count=featured_count,
        recent_testimonials=recent_testimonials
    )

# ============== PROJECTS ==============

@router.post("/projects", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Create a new project"""
    db = get_database()
    
    project_doc = {
        "name": project_data.name,
        "description": project_data.description,
        "client_name": project_data.client_name,
        "client_email": project_data.client_email,
        "client_company": project_data.client_company,
        "project_url": project_data.project_url,
        "project_image": project_data.project_image,
        "tags": project_data.tags or [],
        "status": project_data.status.value,
        "admin_id": current_admin["admin_id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.projects.insert_one(project_doc)
    
    return ProjectResponse(
        id=str(result.inserted_id),
        name=project_doc["name"],
        description=project_doc["description"],
        client_name=project_doc["client_name"],
        client_email=project_doc["client_email"],
        client_company=project_doc["client_company"],
        project_url=project_doc["project_url"],
        project_image=project_doc["project_image"],
        tags=project_doc["tags"],
        status=project_doc["status"],
        created_at=project_doc["created_at"],
        updated_at=project_doc["updated_at"],
        testimonial_count=0,
        has_testimonial=False
    )

@router.get("/projects", response_model=List[ProjectResponse])
async def get_all_projects(current_admin: dict = Depends(get_current_admin)):
    """Get all projects"""
    db = get_database()
    
    projects = []
    cursor = db.projects.find().sort("created_at", -1)
    
    async for project in cursor:
        project_id = str(project["_id"])
        
        # Count testimonials for this project
        testimonial_count = await db.testimonials.count_documents({"project_id": project_id})
        
        projects.append(ProjectResponse(
            id=project_id,
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
            updated_at=project["updated_at"],
            testimonial_count=testimonial_count,
            has_testimonial=testimonial_count > 0
        ))
    
    return projects

@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, current_admin: dict = Depends(get_current_admin)):
    """Get a single project by ID"""
    db = get_database()
    
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
    
    testimonial_count = await db.testimonials.count_documents({"project_id": project_id})
    
    return ProjectResponse(
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
        updated_at=project["updated_at"],
        testimonial_count=testimonial_count,
        has_testimonial=testimonial_count > 0
    )

@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update a project"""
    db = get_database()
    
    # Build update document
    update_doc = {"updated_at": datetime.utcnow()}
    
    for field, value in project_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if field == "status":
                update_doc[field] = value.value if hasattr(value, 'value') else value
            else:
                update_doc[field] = value
    
    try:
        result = await db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_doc}
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return await get_project(project_id, current_admin)

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, current_admin: dict = Depends(get_current_admin)):
    """Delete a project and its associated tokens and testimonials"""
    db = get_database()
    
    try:
        # Delete project
        result = await db.projects.delete_one({"_id": ObjectId(project_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Delete associated tokens
        await db.tokens.delete_many({"project_id": project_id})
        
        # Delete associated testimonials
        await db.testimonials.delete_many({"project_id": project_id})
        
    except HTTPException:
        raise
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    return {"message": "Project deleted successfully"}
