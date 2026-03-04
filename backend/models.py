"""
Database Models Module
Eswatya AI Health Care System

Defines all database tables using SQLAlchemy ORM.
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Boolean, Time, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    """
    User model for patient authentication and profile.
    Stores patient information and credentials.
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String)
    age = Column(Integer)
    gender = Column(String)
    address = Column(Text)
    profile_photo = Column(String)  # URL or path to photo
    role = Column(String, default="patient")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    appointments = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    medical_history = relationship("MedicalHistory", back_populates="patient")
    payments = relationship("Payment", back_populates="patient")

class Doctor(Base):
    """
    Doctor model for healthcare providers.
    Stores doctor credentials and specialization.
    """
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    qualification = Column(String)
    experience_years = Column(Integer)
    phone = Column(String)
    consultation_fee = Column(Float)
    available_days = Column(String)  # JSON string: ["Monday", "Tuesday"]
    available_time_start = Column(String)  # e.g., "09:00"
    available_time_end = Column(String)    # e.g., "17:00"
    profile_photo = Column(String)  # URL or path to photo
    bio = Column(Text)  # Doctor's biography
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    appointments = relationship("Appointment", back_populates="doctor")
    time_slots = relationship("DoctorTimeSlot", back_populates="doctor")

class DoctorTimeSlot(Base):
    """
    Time slots for doctor availability.
    Manages booking slots for each doctor.
    """
    __tablename__ = "doctor_time_slots"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    date = Column(Date, nullable=False)
    time_slot = Column(String, nullable=False)  # e.g., "09:00-09:30"
    is_booked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="time_slots")

class Appointment(Base):
    """
    Appointment model for booking management.
    Links patients with doctors and tracks appointment status.
    """
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    appointment_date = Column(DateTime, nullable=False)
    time_slot = Column(String)  # e.g., "09:00-09:30"
    symptoms = Column(Text)  # JSON string of symptoms
    predicted_disease = Column(String)
    confidence_score = Column(Float)
    status = Column(String, default="pending")  # pending, approved, rejected, completed, cancelled
    consultation_notes = Column(Text)
    payment_status = Column(String, default="pending")  # pending, paid, refunded
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = relationship("User", back_populates="appointments", foreign_keys=[patient_id])
    doctor = relationship("Doctor", back_populates="appointments")
    payment = relationship("Payment", back_populates="appointment", uselist=False)

class Payment(Base):
    """
    Payment model for appointment payments.
    Tracks payment transactions.
    """
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")  # Indian Rupees
    payment_method = Column(String)  # UPI, Card, Net Banking, Cash
    transaction_id = Column(String)
    status = Column(String, default="pending")  # pending, completed, failed, refunded
    payment_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    appointment = relationship("Appointment", back_populates="payment")
    patient = relationship("User", back_populates="payments")

class MedicalHistory(Base):
    """
    Medical History model for tracking patient health records.
    Stores AI predictions and consultation history.
    """
    __tablename__ = "medical_history"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symptoms = Column(Text)  # JSON string
    predicted_disease = Column(String)
    confidence_score = Column(Float)
    recommended_specialist = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = relationship("User", back_populates="medical_history")

class Medication(Base):
    """
    Medication model for OTC medication recommendations.
    Maps diseases to suggested medications.
    """
    __tablename__ = "medications"
    
    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String, nullable=False, index=True)
    medication_name = Column(String, nullable=False)
    dosage = Column(String)
    frequency = Column(String)
    duration = Column(String)
    precautions = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Admin(Base):
    """
    Admin model for system administrators.
    Manages doctors and views all appointments.
    """
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="admin")
    created_at = Column(DateTime, default=datetime.utcnow)
