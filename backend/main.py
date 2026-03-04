"""
Eswatya AI Health Care System - Main Backend Application
Academic Research Project: AI-Enhanced Intelligent Doctor Appointment and Medication Recommendation System
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pickle
import pandas as pd
import numpy as np
from typing import List
import json

# Import local modules
import models
import schemas
import auth
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(
    title="Eswatya AI Health Care System",
    description="AI-Enhanced Doctor Appointment and Medication Recommendation System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model, label encoder, and feature columns
model = pickle.load(open("model.pkl", "rb"))
label_encoder = pickle.load(open("label_encoder.pkl", "rb"))
feature_columns = pickle.load(open("feature_columns.pkl", "rb"))
print(f"Model loaded: {len(label_encoder.classes_)} diseases, {len(feature_columns)} symptoms")

# Intelligent specialist mapping function
def get_specialist_for_disease(disease_name: str) -> str:
    """
    Intelligently map disease to specialist using keyword detection.
    Supports 677+ diseases with smart categorization.
    """
    disease_lower = disease_name.lower()
    
    # Cardiology - Heart, blood vessels, circulation
    cardio_keywords = [
        'heart', 'cardiac', 'cardio', 'coronary', 'myocardial', 'angina',
        'arrhythmia', 'brady', 'tachy', 'atrial', 'ventricular', 'valve',
        'hypertension', 'blood pressure', 'circulation', 'vascular', 'varicose'
    ]
    if any(kw in disease_lower for kw in cardio_keywords):
        return "Cardiologist"
    
    # Neurology - Brain, nerves, nervous system
    neuro_keywords = [
        'neuro', 'brain', 'nerve', 'paralysis', 'stroke', 'seizure', 'epilepsy',
        'parkinson', 'alzheimer', 'dementia', 'migraine', 'headache', 'sclerosis',
        'neuropathy', 'cerebral', 'spinal', 'meningitis', 'encephalitis'
    ]
    if any(kw in disease_lower for kw in neuro_keywords):
        return "Neurologist"
    
    # Pulmonology - Lungs, respiratory system
    pulmo_keywords = [
        'lung', 'pulmonary', 'respiratory', 'pneumonia', 'asthma', 'bronch',
        'copd', 'tuberculosis', 'tb', 'breathing', 'wheez', 'emphysema',
        'pleural', 'thoracic'
    ]
    if any(kw in disease_lower for kw in pulmo_keywords):
        return "Pulmonologist"
    
    # Dermatology - Skin, hair, nails
    derma_keywords = [
        'skin', 'derma', 'rash', 'acne', 'psoriasis', 'eczema', 'fungal',
        'impetigo', 'wart', 'mole', 'melanoma', 'dermatitis', 'hives',
        'urticaria', 'vitiligo', 'alopecia', 'nail', 'hair'
    ]
    if any(kw in disease_lower for kw in derma_keywords):
        return "Dermatologist"
    
    # Orthopedics - Bones, joints, muscles
    ortho_keywords = [
        'bone', 'joint', 'arthritis', 'fracture', 'osteo', 'spondyl',
        'spine', 'vertebra', 'disc', 'ligament', 'tendon', 'cartilage',
        'musculoskeletal', 'rheumat', 'back pain', 'neck pain'
    ]
    if any(kw in disease_lower for kw in ortho_keywords):
        return "Orthopedist"
    
    # Pediatrics - Children's diseases
    pedia_keywords = [
        'child', 'infant', 'pediatric', 'chickenpox', 'measles', 'mumps',
        'whooping cough', 'croup', 'neonatal', 'congenital'
    ]
    if any(kw in disease_lower for kw in pedia_keywords):
        return "Pediatrician"
    
    # Gynecology - Women's reproductive health
    gynec_keywords = [
        'gynec', 'uterus', 'ovary', 'cervix', 'menstrual', 'pregnancy',
        'pcos', 'endometriosis', 'menopause', 'vaginal', 'breast',
        'obstetric', 'maternal'
    ]
    if any(kw in disease_lower for kw in gynec_keywords):
        return "Gynecologist"
    
    # Default to General Physician for everything else
    return "General Physician"

# Medication database
MEDICATION_DATABASE = {
    "common cold": [
        {"name": "Paracetamol", "dosage": "500mg", "frequency": "3 times daily", "duration": "3-5 days"},
        {"name": "Vitamin C", "dosage": "500mg", "frequency": "Once daily", "duration": "5 days"}
    ],
    "fever": [
        {"name": "Ibuprofen", "dosage": "400mg", "frequency": "Every 6 hours", "duration": "As needed"}
    ],
    "headache": [
        {"name": "Aspirin", "dosage": "325mg", "frequency": "Every 4-6 hours", "duration": "As needed"}
    ],
    "cough": [
        {"name": "Dextromethorphan", "dosage": "10-20mg", "frequency": "Every 4 hours", "duration": "7 days"}
    ]
}

@app.get("/")
def root():
    return {
        "message": "Eswatya AI Health Care System API",
        "status": "running",
        "version": "1.0.0"
    }

@app.post("/auth/register/patient", response_model=schemas.UserResponse)
def register_patient(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new patient account."""
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=auth.get_password_hash(user.password),
        full_name=user.full_name,
        phone=user.phone,
        age=user.age,
        gender=user.gender,
        role="patient"
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/register/doctor", response_model=schemas.DoctorResponse)
def register_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    """Register a new doctor account."""
    if db.query(models.Doctor).filter(models.Doctor.username == doctor.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if db.query(models.Doctor).filter(models.Doctor.email == doctor.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_doctor = models.Doctor(
        email=doctor.email,
        username=doctor.username,
        hashed_password=auth.get_password_hash(doctor.password),
        full_name=doctor.full_name,
        specialization=doctor.specialization,
        qualification=doctor.qualification,
        experience_years=doctor.experience_years,
        phone=doctor.phone,
        consultation_fee=doctor.consultation_fee,
        available_days=doctor.available_days,
        available_time=doctor.available_time
    )
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@app.post("/auth/login", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint for patients, doctors, and admins."""
    user = None
    
    if login_data.user_type == "patient":
        # Try username first, then email
        user = db.query(models.User).filter(models.User.username == login_data.username).first()
        if not user:
            user = db.query(models.User).filter(models.User.email == login_data.username).first()
    elif login_data.user_type == "doctor":
        # Try username first, then email
        user = db.query(models.Doctor).filter(models.Doctor.username == login_data.username).first()
        if not user:
            user = db.query(models.Doctor).filter(models.Doctor.email == login_data.username).first()
    elif login_data.user_type == "admin":
        # Try username first, then email
        user = db.query(models.Admin).filter(models.Admin.username == login_data.username).first()
        if not user:
            user = db.query(models.Admin).filter(models.Admin.email == login_data.username).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")
    
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = auth.create_access_token(
        data={"sub": user.username, "user_type": login_data.user_type}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": login_data.user_type
    }

@app.get("/patient/profile", response_model=schemas.UserResponse)
def get_patient_profile(current_user: models.User = Depends(auth.get_current_user)):
    """Get current patient profile."""
    return current_user

@app.put("/patient/profile", response_model=schemas.UserResponse)
def update_patient_profile(
    profile_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update patient profile."""
    if profile_update.full_name:
        current_user.full_name = profile_update.full_name
    if profile_update.phone:
        current_user.phone = profile_update.phone
    if profile_update.age:
        current_user.age = profile_update.age
    if profile_update.gender:
        current_user.gender = profile_update.gender
    if profile_update.address:
        current_user.address = profile_update.address
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/symptoms")
def get_symptoms():
    """Get all available symptoms for selection."""
    return {"symptoms": feature_columns}

@app.post("/predict", response_model=schemas.PredictionResponse)
def predict_disease(
    request: schemas.PredictionRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """AI-powered disease prediction based on symptoms - Returns top 3 predictions."""
    try:
        if not request.symptoms:
            raise HTTPException(status_code=400, detail="No symptoms provided")
        
        input_data = {col: 0 for col in feature_columns}
        for symptom in request.symptoms:
            if symptom in input_data:
                input_data[symptom] = 1
        
        input_df = pd.DataFrame([input_data])
        
        # Get all class probabilities
        probabilities = model.predict_proba(input_df)[0]
        classes = label_encoder.classes_
        
        # Get top 3 predictions
        top_3_indices = np.argsort(probabilities)[-3:][::-1]  # Get indices of top 3, reversed
        
        predictions_list = []
        for idx in top_3_indices:
            disease = classes[idx]
            confidence = float(probabilities[idx])
            
            # Use intelligent specialist mapping
            recommended_specialist = get_specialist_for_disease(disease)
            
            predictions_list.append({
                "disease": disease,
                "confidence": round(confidence, 4),
                "specialist": recommended_specialist
            })
        
        # Get medications for the top prediction
        top_disease = predictions_list[0]["disease"]
        medications = MEDICATION_DATABASE.get(top_disease.lower(), [])
        
        # Store medical record with top prediction
        medical_record = models.MedicalHistory(
            patient_id=current_user.id,
            symptoms=json.dumps(request.symptoms),
            predicted_disease=top_disease,
            confidence_score=predictions_list[0]["confidence"],
            recommended_specialist=predictions_list[0]["specialist"]
        )
        db.add(medical_record)
        db.commit()
        
        return {
            "predictions": predictions_list,
            "medications": medications
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/doctors", response_model=List[schemas.DoctorResponse])
def get_doctors(specialization: str = None, db: Session = Depends(get_db)):
    """Get list of all doctors."""
    query = db.query(models.Doctor).filter(models.Doctor.is_active == True)
    if specialization:
        query = query.filter(models.Doctor.specialization.ilike(f"%{specialization}%"))
    return query.all()

@app.get("/doctor/appointments", response_model=List[schemas.AppointmentResponse])
def get_doctor_appointments(
    current_doctor: models.Doctor = Depends(auth.get_current_doctor),
    db: Session = Depends(get_db)
):
    """Get all appointments for current doctor."""
    appointments = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == current_doctor.id
    ).all()
    
    for apt in appointments:
        patient = db.query(models.User).filter(models.User.id == apt.patient_id).first()
        apt.patient_name = patient.full_name if patient else "Unknown"
        apt.doctor_name = current_doctor.full_name
        apt.doctor_specialization = current_doctor.specialization
    
    return appointments

@app.put("/doctor/appointment/{appointment_id}", response_model=schemas.AppointmentResponse)
def update_appointment(
    appointment_id: int,
    update_data: schemas.AppointmentUpdate,
    current_doctor: models.Doctor = Depends(auth.get_current_doctor),
    db: Session = Depends(get_db)
):
    """Update appointment status and add consultation notes."""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == current_doctor.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = update_data.status
    if update_data.consultation_notes:
        appointment.consultation_notes = update_data.consultation_notes
    
    db.commit()
    db.refresh(appointment)
    
    patient = db.query(models.User).filter(models.User.id == appointment.patient_id).first()
    appointment.patient_name = patient.full_name if patient else "Unknown"
    appointment.doctor_name = current_doctor.full_name
    appointment.doctor_specialization = current_doctor.specialization
    
    return appointment

@app.post("/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appointment."""
    doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db_appointment = models.Appointment(
        patient_id=current_user.id,
        doctor_id=appointment.doctor_id,
        appointment_date=appointment.appointment_date,
        symptoms=json.dumps(appointment.symptoms),
        predicted_disease=appointment.predicted_disease,
        confidence_score=appointment.confidence_score,
        status="pending"
    )
    
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    db_appointment.patient_name = current_user.full_name
    db_appointment.doctor_name = doctor.full_name
    db_appointment.doctor_specialization = doctor.specialization
    
    return db_appointment

@app.get("/appointments", response_model=List[schemas.AppointmentResponse])
def get_patient_appointments(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all appointments for current patient."""
    appointments = db.query(models.Appointment).filter(
        models.Appointment.patient_id == current_user.id
    ).all()
    
    for apt in appointments:
        doctor = db.query(models.Doctor).filter(models.Doctor.id == apt.doctor_id).first()
        apt.patient_name = current_user.full_name
        apt.doctor_name = doctor.full_name if doctor else "Unknown"
        apt.doctor_specialization = doctor.specialization if doctor else "Unknown"
    
    return appointments

@app.put("/appointments/{appointment_id}/cancel")
def cancel_appointment(
    appointment_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel an appointment (patient only)."""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if appointment.status == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel completed appointment")
    
    if appointment.status == "cancelled":
        raise HTTPException(status_code=400, detail="Appointment already cancelled")
    
    appointment.status = "cancelled"
    db.commit()
    
    return {"message": "Appointment cancelled successfully", "appointment_id": appointment_id}

@app.get("/medical-history", response_model=List[schemas.MedicalHistoryResponse])
def get_medical_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get medical history for current patient."""
    return db.query(models.MedicalHistory).filter(
        models.MedicalHistory.patient_id == current_user.id
    ).order_by(models.MedicalHistory.created_at.desc()).all()

# ============= Doctor Profile Management =============

@app.get("/doctor/profile", response_model=schemas.DoctorResponse)
def get_doctor_profile(current_doctor: models.Doctor = Depends(auth.get_current_doctor)):
    """Get current doctor profile."""
    return current_doctor

@app.put("/doctor/profile", response_model=schemas.DoctorResponse)
def update_doctor_profile(
    profile_update: schemas.DoctorUpdate,
    current_doctor: models.Doctor = Depends(auth.get_current_doctor),
    db: Session = Depends(get_db)
):
    """Update doctor profile."""
    if profile_update.full_name:
        current_doctor.full_name = profile_update.full_name
    if profile_update.phone:
        current_doctor.phone = profile_update.phone
    if profile_update.qualification:
        current_doctor.qualification = profile_update.qualification
    if profile_update.experience_years:
        current_doctor.experience_years = profile_update.experience_years
    if profile_update.consultation_fee:
        current_doctor.consultation_fee = profile_update.consultation_fee
    if profile_update.available_days:
        current_doctor.available_days = profile_update.available_days
    if profile_update.available_time_start:
        current_doctor.available_time_start = profile_update.available_time_start
    if profile_update.available_time_end:
        current_doctor.available_time_end = profile_update.available_time_end
    if profile_update.bio:
        current_doctor.bio = profile_update.bio
    if profile_update.profile_photo:
        current_doctor.profile_photo = profile_update.profile_photo
    
    db.commit()
    db.refresh(current_doctor)
    return current_doctor

# ============= Time Slots Endpoints =============

@app.get("/doctors/{doctor_id}/slots")
def get_doctor_slots(doctor_id: int, date: str = None, db: Session = Depends(get_db)):
    """Get available time slots for a doctor."""
    query = db.query(models.DoctorTimeSlot).filter(
        models.DoctorTimeSlot.doctor_id == doctor_id,
        models.DoctorTimeSlot.is_booked == False
    )
    
    if date:
        from datetime import datetime
        slot_date = datetime.strptime(date, "%Y-%m-%d").date()
        query = query.filter(models.DoctorTimeSlot.date == slot_date)
    
    slots = query.all()
    return {"slots": [{"id": s.id, "date": str(s.date), "time_slot": s.time_slot} for s in slots]}

# ============= Payment Endpoints =============

@app.post("/payments", response_model=schemas.PaymentResponse)
def create_payment(
    payment: schemas.PaymentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Process payment for appointment."""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == payment.appointment_id,
        models.Appointment.patient_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db_payment = models.Payment(
        appointment_id=payment.appointment_id,
        patient_id=current_user.id,
        amount=payment.amount,
        currency="INR",
        payment_method=payment.payment_method,
        transaction_id=payment.transaction_id,
        status="completed",
        payment_date=datetime.utcnow()
    )
    
    appointment.payment_status = "paid"
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.get("/payments/{appointment_id}", response_model=schemas.PaymentResponse)
def get_payment(
    appointment_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get payment details for an appointment."""
    payment = db.query(models.Payment).filter(
        models.Payment.appointment_id == appointment_id,
        models.Payment.patient_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return payment

# ============= Admin Endpoints =============

def get_current_admin(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    """Get current admin user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    
    try:
        from jose import jwt
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        user_type: str = payload.get("user_type")
        
        if user_type != "admin":
            raise credentials_exception
            
    except:
        raise credentials_exception
    
    admin = db.query(models.Admin).filter(models.Admin.username == username).first()
    if not admin:
        raise credentials_exception
    
    return admin

@app.post("/auth/register/admin", response_model=schemas.AdminResponse)
def register_admin(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    """Register a new admin account."""
    if db.query(models.Admin).filter(models.Admin.username == admin.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if db.query(models.Admin).filter(models.Admin.email == admin.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_admin = models.Admin(
        email=admin.email,
        username=admin.username,
        hashed_password=auth.get_password_hash(admin.password),
        full_name=admin.full_name,
        role="admin"
    )
    
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

@app.get("/test-admin")
def test_admin_endpoint():
    """Test endpoint to verify admin routes are loaded."""
    return {"message": "Admin routes are working!", "timestamp": "2024"}

@app.get("/admin/appointments", response_model=List[schemas.AppointmentResponse])
def get_all_appointments(
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all appointments (admin only)."""
    appointments = db.query(models.Appointment).all()
    
    for apt in appointments:
        patient = db.query(models.User).filter(models.User.id == apt.patient_id).first()
        doctor = db.query(models.Doctor).filter(models.Doctor.id == apt.doctor_id).first()
        apt.patient_name = patient.full_name if patient else "Unknown"
        apt.doctor_name = doctor.full_name if doctor else "Unknown"
        apt.doctor_specialization = doctor.specialization if doctor else "Unknown"
    
    return appointments

@app.get("/admin/stats", response_model=schemas.SystemStats)
def get_system_stats(
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get system statistics (admin only)."""
    total_patients = db.query(models.User).count()
    total_doctors = db.query(models.Doctor).count()
    total_appointments = db.query(models.Appointment).count()
    pending_appointments = db.query(models.Appointment).filter(
        models.Appointment.status == "pending"
    ).count()
    completed_appointments = db.query(models.Appointment).filter(
        models.Appointment.status == "completed"
    ).count()
    
    total_revenue = db.query(models.Payment).filter(
        models.Payment.status == "completed"
    ).with_entities(func.sum(models.Payment.amount)).scalar() or 0.0
    
    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments,
        "completed_appointments": completed_appointments,
        "total_revenue": float(total_revenue)
    }

@app.post("/admin/doctors", response_model=schemas.DoctorResponse)
def admin_add_doctor(
    doctor: schemas.DoctorCreate,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Add a new doctor (admin only)."""
    if db.query(models.Doctor).filter(models.Doctor.username == doctor.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if db.query(models.Doctor).filter(models.Doctor.email == doctor.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_doctor = models.Doctor(
        email=doctor.email,
        username=doctor.username,
        hashed_password=auth.get_password_hash(doctor.password),
        full_name=doctor.full_name,
        specialization=doctor.specialization,
        qualification=doctor.qualification,
        experience_years=doctor.experience_years,
        phone=doctor.phone,
        consultation_fee=doctor.consultation_fee,
        available_days=doctor.available_days,
        available_time_start=doctor.available_time_start,
        available_time_end=doctor.available_time_end,
        bio=doctor.bio,
        profile_photo=doctor.profile_photo
    )
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@app.get("/admin/doctors", response_model=List[schemas.DoctorResponse])
def admin_get_all_doctors(
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all doctors (admin only)."""
    return db.query(models.Doctor).all()

@app.delete("/admin/doctors/{doctor_id}")
def admin_delete_doctor(
    doctor_id: int,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a doctor (admin only)."""
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}

from sqlalchemy import func

# ============= Admin User Management Endpoints =============

@app.get("/admin/users", response_model=List[schemas.UserResponse])
def admin_get_all_users(
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users/patients (admin only)."""
    return db.query(models.User).all()

@app.delete("/admin/users/{user_id}")
def admin_delete_user(
    user_id: int,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a user/patient (admin only)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete related records first
    db.query(models.Appointment).filter(models.Appointment.patient_id == user_id).delete()
    db.query(models.MedicalHistory).filter(models.MedicalHistory.patient_id == user_id).delete()
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# ============= Main Entry Point =============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
