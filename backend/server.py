"""
Server Entry Point for Render Deployment
Run with: uvicorn server:app --host 0.0.0.0 --port $PORT
"""

from app.main import app

# Re-export app for uvicorn
__all__ = ["app"]