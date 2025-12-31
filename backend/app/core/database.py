"""
Database Configuration - MongoDB Connection
"""

from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db = None

db = Database()

# Environment Variables
MONGODB_URL = os.environ.get("MONGODB_URL", "")
DATABASE_NAME = os.environ.get("DATABASE_NAME", "testimonial_system")

async def connect_to_mongo():
    """Connect to MongoDB Atlas"""
    if not MONGODB_URL:
        raise ValueError("MONGODB_URL environment variable is not set")
    
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.db = db.client[DATABASE_NAME]
    
    # Create indexes for better performance
    await db.db.projects.create_index("created_at")
    await db.db.tokens.create_index("token", unique=True)
    await db.db.tokens.create_index("expires_at")
    await db.db.testimonials.create_index("project_id")
    await db.db.testimonials.create_index("created_at")
    await db.db.admins.create_index("username", unique=True)
    
    print("✅ Connected to MongoDB Atlas")

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("🔴 Disconnected from MongoDB Atlas")

def get_database():
    """Get database instance"""
    return db.db