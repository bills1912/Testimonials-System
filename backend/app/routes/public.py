"""
Public Routes - Public endpoints for testimonial display
"""

from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

from app.core.database import get_database
from app.schemas.schemas import (
    PublicTestimonialResponse,
    PublicProjectResponse
)

router = APIRouter()

@router.get("/testimonials", response_model=List[PublicTestimonialResponse])
async def get_public_testimonials(
    featured_only: bool = False,
    limit: int = 50
):
    """Get all published testimonials for public display"""
    db = get_database()
    
    query = {"is_published": True}
    if featured_only:
        query["is_featured"] = True
    
    testimonials = []
    cursor = db.testimonials.find(query).sort("created_at", -1).limit(limit)
    
    async for testimonial in cursor:
        # Get project name
        try:
            project = await db.projects.find_one({"_id": ObjectId(testimonial["project_id"])})
            project_name = project["name"] if project else "Project"
        except:
            project_name = "Project"
        
        testimonials.append(PublicTestimonialResponse(
            id=str(testimonial["_id"]),
            client_name=testimonial["client_name"],
            client_role=testimonial.get("client_role"),
            client_company=testimonial.get("client_company"),
            client_avatar=testimonial.get("client_avatar"),
            rating=testimonial["rating"],
            title=testimonial["title"],
            content=testimonial["content"],
            project_name=project_name,
            is_featured=testimonial.get("is_featured", False),
            created_at=testimonial["created_at"]
        ))
    
    return testimonials

@router.get("/testimonials/featured", response_model=List[PublicTestimonialResponse])
async def get_featured_testimonials(limit: int = 10):
    """Get featured testimonials for homepage display"""
    return await get_public_testimonials(featured_only=True, limit=limit)

@router.get("/projects", response_model=List[PublicProjectResponse])
async def get_public_projects():
    """Get all projects with their testimonials for public portfolio"""
    db = get_database()
    
    projects = []
    cursor = db.projects.find({"status": {"$ne": "archived"}}).sort("created_at", -1)
    
    async for project in cursor:
        project_id = str(project["_id"])
        
        # Get testimonials for this project
        testimonials = []
        t_cursor = db.testimonials.find({
            "project_id": project_id,
            "is_published": True
        }).sort("created_at", -1)
        
        async for testimonial in t_cursor:
            testimonials.append(PublicTestimonialResponse(
                id=str(testimonial["_id"]),
                client_name=testimonial["client_name"],
                client_role=testimonial.get("client_role"),
                client_company=testimonial.get("client_company"),
                client_avatar=testimonial.get("client_avatar"),
                rating=testimonial["rating"],
                title=testimonial["title"],
                content=testimonial["content"],
                project_name=project["name"],
                is_featured=testimonial.get("is_featured", False),
                created_at=testimonial["created_at"]
            ))
        
        projects.append(PublicProjectResponse(
            id=project_id,
            name=project["name"],
            description=project.get("description"),
            project_url=project.get("project_url"),
            project_image=project.get("project_image"),
            tags=project.get("tags", []),
            testimonials=testimonials
        ))
    
    return projects

@router.get("/stats")
async def get_public_stats():
    """Get public statistics for display"""
    db = get_database()
    
    total_projects = await db.projects.count_documents({"status": {"$ne": "archived"}})
    total_testimonials = await db.testimonials.count_documents({"is_published": True})
    
    # Get average rating
    pipeline = [
        {"$match": {"is_published": True}},
        {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
    ]
    rating_result = await db.testimonials.aggregate(pipeline).to_list(1)
    average_rating = rating_result[0]["avg_rating"] if rating_result else 5.0
    
    # Get rating distribution
    rating_pipeline = [
        {"$match": {"is_published": True}},
        {"$group": {"_id": "$rating", "count": {"$sum": 1}}}
    ]
    rating_dist = await db.testimonials.aggregate(rating_pipeline).to_list(5)
    rating_distribution = {str(r["_id"]): r["count"] for r in rating_dist}
    
    return {
        "total_projects": total_projects,
        "total_testimonials": total_testimonials,
        "average_rating": round(average_rating, 2),
        "rating_distribution": rating_distribution,
        "satisfaction_rate": round((average_rating / 5) * 100, 1)
    }
