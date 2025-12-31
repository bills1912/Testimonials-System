"""
Pydantic Schemas - Data validation and serialization
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ============== ADMIN SCHEMAS ==============

class AdminCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=100)

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse

# ============== PROJECT SCHEMAS ==============

class ProjectStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    client_name: str = Field(..., min_length=2, max_length=100)
    client_email: Optional[EmailStr] = None
    client_company: Optional[str] = Field(None, max_length=200)
    project_url: Optional[str] = None
    project_image: Optional[str] = None
    tags: Optional[List[str]] = []
    status: ProjectStatus = ProjectStatus.ACTIVE

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    client_name: Optional[str] = Field(None, min_length=2, max_length=100)
    client_email: Optional[EmailStr] = None
    client_company: Optional[str] = Field(None, max_length=200)
    project_url: Optional[str] = None
    project_image: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[ProjectStatus] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    client_name: str
    client_email: Optional[str]
    client_company: Optional[str]
    project_url: Optional[str]
    project_image: Optional[str]
    tags: List[str]
    status: str
    created_at: datetime
    updated_at: datetime
    testimonial_count: int = 0
    has_testimonial: bool = False

# ============== INVITE TOKEN SCHEMAS ==============

class TokenStatus(str, Enum):
    ACTIVE = "active"
    USED = "used"
    EXPIRED = "expired"
    REVOKED = "revoked"

class InviteTokenCreate(BaseModel):
    project_id: str
    expires_hours: int = Field(default=72, ge=1, le=720)  # 1 hour to 30 days
    note: Optional[str] = Field(None, max_length=500)

class InviteTokenResponse(BaseModel):
    id: str
    token: str
    project_id: str
    project_name: str
    status: str
    created_at: datetime
    expires_at: datetime
    used_at: Optional[datetime] = None
    note: Optional[str] = None
    invite_url: str

class TokenValidationResponse(BaseModel):
    valid: bool
    project: Optional[ProjectResponse] = None
    message: str

# ============== TESTIMONIAL SCHEMAS ==============

class TestimonialCreate(BaseModel):
    """Schema for client submitting testimonial via invite link"""
    token: str
    client_name: str = Field(..., min_length=2, max_length=100)
    client_role: Optional[str] = Field(None, max_length=100)
    client_company: Optional[str] = Field(None, max_length=200)
    client_avatar: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=20, max_length=5000)
    is_featured: bool = False

class TestimonialUpdate(BaseModel):
    """Schema for admin updating testimonial"""
    client_name: Optional[str] = Field(None, min_length=2, max_length=100)
    client_role: Optional[str] = Field(None, max_length=100)
    client_company: Optional[str] = Field(None, max_length=200)
    client_avatar: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    content: Optional[str] = Field(None, min_length=20, max_length=5000)
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None

class TestimonialResponse(BaseModel):
    id: str
    project_id: str
    project_name: str
    client_name: str
    client_role: Optional[str]
    client_company: Optional[str]
    client_avatar: Optional[str]
    rating: int
    title: str
    content: str
    is_featured: bool
    is_published: bool
    created_at: datetime
    updated_at: datetime

# ============== PUBLIC SCHEMAS ==============

class PublicTestimonialResponse(BaseModel):
    """Schema for public testimonial display (limited info)"""
    id: str
    client_name: str
    client_role: Optional[str]
    client_company: Optional[str]
    client_avatar: Optional[str]
    rating: int
    title: str
    content: str
    project_name: str
    is_featured: bool
    created_at: datetime

class PublicProjectResponse(BaseModel):
    """Schema for public project display"""
    id: str
    name: str
    description: Optional[str]
    project_url: Optional[str]
    project_image: Optional[str]
    tags: List[str]
    testimonials: List[PublicTestimonialResponse]

# ============== STATS SCHEMAS ==============

class DashboardStats(BaseModel):
    total_projects: int
    total_testimonials: int
    total_tokens: int
    active_tokens: int
    average_rating: float
    featured_count: int
    recent_testimonials: List[TestimonialResponse]
