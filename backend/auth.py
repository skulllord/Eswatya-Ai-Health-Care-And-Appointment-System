"""
Authentication Module
Eswatya AI Health Care System

Handles JWT token generation, password hashing, and authentication.
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import models
from database import get_db

# Security configuration
SECRET_KEY = "eswatya-healthcare-secret-key-2024-research-project"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Password hashing context - using simpler configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against hashed password."""
    try:
        # Truncate password if too long for bcrypt
        if len(plain_password.encode('utf-8')) > 72:
            plain_password = plain_password[:72]
        
        # Try bcrypt verification first
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except:
            # If bcrypt fails, try SHA256 fallback
            import hashlib
            sha256_hash = hashlib.sha256(plain_password.encode()).hexdigest()
            return sha256_hash == hashed_password
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    try:
        # Truncate password if too long for bcrypt
        if len(password.encode('utf-8')) > 72:
            password = password[:72]
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Password hashing error: {e}")
        # Fallback to simple hash if bcrypt fails
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create JWT access token.
    
    Args:
        data: Dictionary containing user information
        expires_delta: Token expiration time
    
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current authenticated user from JWT token.
    Used as dependency in protected routes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_type: str = payload.get("user_type")
        
        if username is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # Get user based on type
    if user_type == "patient":
        user = db.query(models.User).filter(models.User.username == username).first()
    elif user_type == "doctor":
        user = db.query(models.Doctor).filter(models.Doctor.username == username).first()
    elif user_type == "admin":
        user = db.query(models.Admin).filter(models.Admin.username == username).first()
    else:
        raise credentials_exception
    
    if user is None:
        raise credentials_exception
    
    return user

def get_current_doctor(current_user = Depends(get_current_user)):
    """Ensure current user is a doctor."""
    if not isinstance(current_user, models.Doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized. Doctor access required."
        )
    return current_user
