"""
Database Configuration Module
Eswatya AI Health Care System - Academic Research Project

This module handles database connection and session management.
Using SQLite for easy setup (no PostgreSQL installation required).
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database connection URL
# Using SQLite for simplicity (file-based database)
# For PostgreSQL, use: postgresql://username:password@host:port/database_name
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./eswatya_healthcare.db"
)

# Create SQLAlchemy engine
# check_same_thread=False is needed for SQLite with FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models
Base = declarative_base()

def get_db():
    """
    Dependency function to get database session.
    Yields a database session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
