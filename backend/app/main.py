"""
Testimonial System Backend - FastAPI Application
A professional invite-only testimonial management system
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routes import admin, testimonials, tokens, public

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle - connect/disconnect from MongoDB"""
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="Testimonial System API",
    description="Professional Invite-Only Testimonial Management System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(tokens.router, prefix="/api/tokens", tags=["Tokens"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["Testimonials"])
app.include_router(public.router, prefix="/api/public", tags=["Public"])

@app.get("/")
async def root():
    return {
        "message": "Testimonial System API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
