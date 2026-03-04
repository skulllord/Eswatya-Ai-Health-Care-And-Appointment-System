"""
Pydantic Schemas Module
Eswatya AI Health Care System

Defines request/response models for API validation.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ============= User Schemas =============

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    profile_photo: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    phone: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    address: Optional[str]
    profile_photo: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= Doctor Schemas =============

class DoctorBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    specialization: str

class DoctorCreate(DoctorBase):
    password: str
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    phone: Optional[str] = None
    consultation_fee: Optional[float] = None
    available_days: Optional[str] = None
    available_time_start: Optional[str] = None
    available_time_end: Optional[str] = None
    profile_photo: Optional[str] = None
    bio: Optional[str] = None

class DoctorResponse(DoctorBase):
    id: int
    qualification: Optional[str]
    experience_years: Optional[int]
    phone: Optional[str]
    consultation_fee: Optional[float]
    available_days: Optional[str]
    available_time_start: Optional[str]
    available_time_end: Optional[str]
    profile_photo: Optional[str]
    bio: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= Authentication Schemas =============

class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str  # patient, doctor, admin

class LoginRequest(BaseModel):
    username: str
    password: str
    user_type: str  # patient, doctor

# ============= Prediction Schemas =============

class PredictionRequest(BaseModel):
    symptoms: List[str]

class DiseasePrediction(BaseModel):
    disease: str
    confidence: float
    specialist: str

class PredictionResponse(BaseModel):
    predictions: List[DiseasePrediction]  # Top 3 predictions
    medications: List[dict]

# ============= Appointment Schemas =============

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: datetime
    symptoms: List[str]
    predicted_disease: str
    confidence_score: float

class AppointmentUpdate(BaseModel):
    status: str
    consultation_notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    symptoms: Optional[str]
    predicted_disease: Optional[str]
    confidence_score: Optional[float]
    status: str
    consultation_notes: Optional[str]
    created_at: datetime
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    doctor_specialization: Optional[str] = None
    
    class Config:
        from_attributes = True

# ============= Medical History Schemas =============

class MedicalHistoryResponse(BaseModel):
    id: int
    symptoms: str
    predicted_disease: str
    confidence_score: float
    recommended_specialist: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Payment Schemas =============

class PaymentCreate(BaseModel):
    appointment_id: int
    amount: float
    payment_method: str  # UPI, Card, Net Banking, Cash
    transaction_id: Optional[str] = None

class PaymentResponse(BaseModel):
    id: int
    appointment_id: int
    patient_id: int
    amount: float
    currency: str
    payment_method: str
    transaction_id: Optional[str]
    status: str
    payment_date: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= Time Slot Schemas =============

class TimeSlotResponse(BaseModel):
    id: int
    doctor_id: int
    date: str
    time_slot: str
    is_booked: bool
    
    class Config:
        from_attributes = True

class AvailableSlot(BaseModel):
    date: str
    time_slot: str
    is_available: bool


# ============= Admin Schemas =============

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= Doctor Update Schema =============

class DoctorUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    consultation_fee: Optional[float] = None
    available_days: Optional[str] = None
    available_time_start: Optional[str] = None
    available_time_end: Optional[str] = None
    bio: Optional[str] = None
    profile_photo: Optional[str] = None

# ============= Statistics Schema =============

class SystemStats(BaseModel):
    total_patients: int
    total_doctors: int
    total_appointments: int
    pending_appointments: int
    completed_appointments: int
    total_revenue: float
