"""
Database Initialization Script
Eswatya AI Health Care System
"""

from database import engine, SessionLocal
import models
import auth
from datetime import datetime, timedelta

def init_database():
    """Create all database tables."""
    print("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")

def seed_doctors():
    """Add sample doctors with real Indian names."""
    db = SessionLocal()
    
    if db.query(models.Doctor).count() > 0:
        print("✓ Doctors already exist")
        db.close()
        return
    
    print("Seeding doctors...")
    
    doctors = [
        # General Physicians (3 doctors)
        {"username": "dr_sharma", "email": "dr.sharma@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Rajesh Sharma", "specialization": "General Physician",
         "qualification": "MBBS, MD", "experience_years": 15, "phone": "+91 98765 43210",
         "consultation_fee": 500.0, "available_days": "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "09:00", "available_time_end": "18:00",
         "bio": "Experienced general physician with 15 years of practice in family medicine."},
        
        {"username": "dr_verma", "email": "dr.verma@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Neha Verma", "specialization": "General Physician",
         "qualification": "MBBS, MD (Medicine)", "experience_years": 8, "phone": "+91 98765 43220",
         "consultation_fee": 450.0, "available_days": "Monday,Tuesday,Wednesday,Thursday,Friday",
         "available_time_start": "10:00", "available_time_end": "19:00",
         "bio": "Compassionate physician focusing on preventive care and chronic disease management."},
        
        {"username": "dr_joshi", "email": "dr.joshi@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Arun Joshi", "specialization": "General Physician",
         "qualification": "MBBS, MD", "experience_years": 20, "phone": "+91 98765 43221",
         "consultation_fee": 600.0, "available_days": "Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
         "available_time_start": "08:00", "available_time_end": "17:00",
         "bio": "Senior physician with expertise in geriatric care and lifestyle diseases."},
        
        # Cardiologists (3 doctors)
        {"username": "dr_patel", "email": "dr.patel@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Priya Patel", "specialization": "Cardiologist",
         "qualification": "MBBS, MD, DM (Cardiology)", "experience_years": 12, "phone": "+91 98765 43211",
         "consultation_fee": 1200.0, "available_days": "Monday,Wednesday,Friday,Saturday",
         "available_time_start": "10:00", "available_time_end": "17:00",
         "bio": "Renowned cardiologist specializing in interventional cardiology and heart disease."},
        
        {"username": "dr_desai", "email": "dr.desai@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Karan Desai", "specialization": "Cardiologist",
         "qualification": "MBBS, MD, DM (Cardiology)", "experience_years": 18, "phone": "+91 98765 43222",
         "consultation_fee": 1500.0, "available_days": "Monday,Tuesday,Thursday,Friday",
         "available_time_start": "09:00", "available_time_end": "16:00",
         "bio": "Expert in cardiac surgery and heart transplant with international training."},
        
        {"username": "dr_nair", "email": "dr.nair@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Meera Nair", "specialization": "Cardiologist",
         "qualification": "MBBS, MD, DM (Cardiology)", "experience_years": 10, "phone": "+91 98765 43223",
         "consultation_fee": 1100.0, "available_days": "Tuesday,Wednesday,Friday,Saturday",
         "available_time_start": "11:00", "available_time_end": "18:00",
         "bio": "Specialist in non-invasive cardiology and preventive heart care."},
        
        # Neurologists (3 doctors)
        {"username": "dr_kumar", "email": "dr.kumar@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Amit Kumar", "specialization": "Neurologist",
         "qualification": "MBBS, MD, DM (Neurology)", "experience_years": 10, "phone": "+91 98765 43212",
         "consultation_fee": 1000.0, "available_days": "Tuesday,Thursday,Friday,Saturday",
         "available_time_start": "11:00", "available_time_end": "19:00",
         "bio": "Expert neurologist with focus on stroke management and epilepsy."},
        
        {"username": "dr_banerjee", "email": "dr.banerjee@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Sanjay Banerjee", "specialization": "Neurologist",
         "qualification": "MBBS, MD, DM (Neurology)", "experience_years": 14, "phone": "+91 98765 43224",
         "consultation_fee": 1200.0, "available_days": "Monday,Wednesday,Thursday,Saturday",
         "available_time_start": "10:00", "available_time_end": "18:00",
         "bio": "Specialist in movement disorders, Parkinson's disease, and headache management."},
        
        {"username": "dr_chopra", "email": "dr.chopra@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Ritu Chopra", "specialization": "Neurologist",
         "qualification": "MBBS, MD, DM (Neurology)", "experience_years": 9, "phone": "+91 98765 43225",
         "consultation_fee": 950.0, "available_days": "Monday,Tuesday,Wednesday,Friday",
         "available_time_start": "09:00", "available_time_end": "17:00",
         "bio": "Neurologist specializing in pediatric neurology and developmental disorders."},
        
        # Dermatologists (3 doctors)
        {"username": "dr_singh", "email": "dr.singh@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Anjali Singh", "specialization": "Dermatologist",
         "qualification": "MBBS, MD (Dermatology)", "experience_years": 8, "phone": "+91 98765 43213",
         "consultation_fee": 800.0, "available_days": "Monday,Tuesday,Wednesday,Thursday,Friday",
         "available_time_start": "09:00", "available_time_end": "16:00",
         "bio": "Skilled dermatologist specializing in cosmetic dermatology and laser treatments."},
        
        {"username": "dr_malhotra", "email": "dr.malhotra@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Rahul Malhotra", "specialization": "Dermatologist",
         "qualification": "MBBS, MD, DNB (Dermatology)", "experience_years": 12, "phone": "+91 98765 43226",
         "consultation_fee": 900.0, "available_days": "Tuesday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "10:00", "available_time_end": "18:00",
         "bio": "Expert in treating skin allergies, acne, and hair loss conditions."},
        
        {"username": "dr_kapoor", "email": "dr.kapoor@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Pooja Kapoor", "specialization": "Dermatologist",
         "qualification": "MBBS, MD (Dermatology)", "experience_years": 7, "phone": "+91 98765 43227",
         "consultation_fee": 750.0, "available_days": "Monday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "11:00", "available_time_end": "19:00",
         "bio": "Dermatologist with expertise in pediatric skin conditions and eczema treatment."},
        
        # Pulmonologists (2 doctors)
        {"username": "dr_reddy", "email": "dr.reddy@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Srinivas Reddy", "specialization": "Pulmonologist",
         "qualification": "MBBS, MD (Pulmonology)", "experience_years": 14, "phone": "+91 98765 43214",
         "consultation_fee": 900.0, "available_days": "Monday,Wednesday,Thursday,Saturday,Sunday",
         "available_time_start": "08:00", "available_time_end": "16:00",
         "bio": "Experienced pulmonologist treating asthma, COPD, and respiratory infections."},
        
        {"username": "dr_rao", "email": "dr.rao@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Deepa Rao", "specialization": "Pulmonologist",
         "qualification": "MBBS, MD, DNB (Pulmonology)", "experience_years": 11, "phone": "+91 98765 43228",
         "consultation_fee": 950.0, "available_days": "Tuesday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "09:00", "available_time_end": "17:00",
         "bio": "Specialist in sleep disorders, tuberculosis, and critical care pulmonology."},
        
        # Pediatricians (3 doctors)
        {"username": "dr_mehta", "email": "dr.mehta@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Kavita Mehta", "specialization": "Pediatrician",
         "qualification": "MBBS, MD (Pediatrics)", "experience_years": 11, "phone": "+91 98765 43215",
         "consultation_fee": 600.0, "available_days": "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "10:00", "available_time_end": "18:00",
         "bio": "Caring pediatrician dedicated to child health and vaccination programs."},
        
        {"username": "dr_agarwal", "email": "dr.agarwal@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Suresh Agarwal", "specialization": "Pediatrician",
         "qualification": "MBBS, MD, DCH (Pediatrics)", "experience_years": 16, "phone": "+91 98765 43229",
         "consultation_fee": 700.0, "available_days": "Monday,Tuesday,Wednesday,Thursday,Friday",
         "available_time_start": "09:00", "available_time_end": "17:00",
         "bio": "Senior pediatrician with expertise in neonatal care and childhood infections."},
        
        {"username": "dr_bose", "email": "dr.bose@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Ananya Bose", "specialization": "Pediatrician",
         "qualification": "MBBS, MD (Pediatrics)", "experience_years": 9, "phone": "+91 98765 43230",
         "consultation_fee": 550.0, "available_days": "Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
         "available_time_start": "10:00", "available_time_end": "19:00",
         "bio": "Pediatrician specializing in growth and developmental disorders in children."},
        
        # Orthopedists (3 doctors)
        {"username": "dr_gupta", "email": "dr.gupta@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Vikram Gupta", "specialization": "Orthopedist",
         "qualification": "MBBS, MS (Orthopedics)", "experience_years": 13, "phone": "+91 98765 43216",
         "consultation_fee": 1100.0, "available_days": "Tuesday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "09:00", "available_time_end": "17:00",
         "bio": "Expert orthopedic surgeon specializing in joint replacement and sports injuries."},
        
        {"username": "dr_saxena", "email": "dr.saxena@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Manoj Saxena", "specialization": "Orthopedist",
         "qualification": "MBBS, MS, MCh (Orthopedics)", "experience_years": 17, "phone": "+91 98765 43231",
         "consultation_fee": 1300.0, "available_days": "Monday,Wednesday,Thursday,Friday",
         "available_time_start": "08:00", "available_time_end": "16:00",
         "bio": "Senior orthopedic surgeon with expertise in spine surgery and trauma care."},
        
        {"username": "dr_pillai", "email": "dr.pillai@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Arjun Pillai", "specialization": "Orthopedist",
         "qualification": "MBBS, MS (Orthopedics)", "experience_years": 10, "phone": "+91 98765 43232",
         "consultation_fee": 1000.0, "available_days": "Monday,Tuesday,Wednesday,Friday,Saturday",
         "available_time_start": "10:00", "available_time_end": "18:00",
         "bio": "Orthopedist specializing in arthroscopy and minimally invasive surgery."},
        
        # Gynecologists (3 doctors)
        {"username": "dr_iyer", "email": "dr.iyer@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Lakshmi Iyer", "specialization": "Gynecologist",
         "qualification": "MBBS, MD (OB/GYN)", "experience_years": 16, "phone": "+91 98765 43217",
         "consultation_fee": 1000.0, "available_days": "Monday,Tuesday,Wednesday,Thursday,Friday",
         "available_time_start": "10:00", "available_time_end": "18:00",
         "bio": "Experienced gynecologist providing comprehensive women's health care and maternity services."},
        
        {"username": "dr_shah", "email": "dr.shah@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Nisha Shah", "specialization": "Gynecologist",
         "qualification": "MBBS, MS (OB/GYN)", "experience_years": 12, "phone": "+91 98765 43233",
         "consultation_fee": 900.0, "available_days": "Monday,Tuesday,Wednesday,Thursday,Saturday",
         "available_time_start": "09:00", "available_time_end": "17:00",
         "bio": "Gynecologist specializing in high-risk pregnancies and infertility treatment."},
        
        {"username": "dr_menon", "email": "dr.menon@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Shreya Menon", "specialization": "Gynecologist",
         "qualification": "MBBS, MD, DNB (OB/GYN)", "experience_years": 9, "phone": "+91 98765 43234",
         "consultation_fee": 850.0, "available_days": "Tuesday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "11:00", "available_time_end": "19:00",
         "bio": "Women's health specialist focusing on PCOS, endometriosis, and menopause management."}
    ]
    
    for d in doctors:
        doctor = models.Doctor(
            username=d["username"], email=d["email"],
            hashed_password=auth.get_password_hash(d["password"]),
            full_name=d["full_name"], specialization=d["specialization"],
            qualification=d["qualification"], experience_years=d["experience_years"],
            phone=d["phone"], consultation_fee=d["consultation_fee"],
            available_days=d["available_days"],
            available_time_start=d["available_time_start"],
            available_time_end=d["available_time_end"],
            bio=d["bio"], is_active=True
        )
        db.add(doctor)
    
    db.commit()
    print(f"✓ Added {len(doctors)} doctors")
    db.close()

def generate_time_slots():
    """Generate time slots for next 7 days."""
    db = SessionLocal()
    
    if db.query(models.DoctorTimeSlot).count() > 0:
        print("✓ Time slots exist")
        db.close()
        return
    
    print("Generating time slots...")
    doctors = db.query(models.Doctor).all()
    count = 0
    
    for doctor in doctors:
        for day in range(7):
            date = datetime.now().date() + timedelta(days=day)
            day_name = date.strftime("%A")
            
            if doctor.available_days and day_name in doctor.available_days:
                start = int(doctor.available_time_start.split(":")[0]) if doctor.available_time_start else 9
                end = int(doctor.available_time_end.split(":")[0]) if doctor.available_time_end else 17
                
                for hour in range(start, end):
                    for minute in [0, 30]:
                        if minute == 0:
                            slot = f"{hour:02d}:00-{hour:02d}:30"
                        else:
                            slot = f"{hour:02d}:30-{hour+1:02d}:00"
                        
                        db.add(models.DoctorTimeSlot(
                            doctor_id=doctor.id, date=date,
                            time_slot=slot, is_booked=False
                        ))
                        count += 1
    
    db.commit()
    print(f"✓ Generated {count} time slots")
    db.close()

def seed_admin():
    """Add default admin user."""
    db = SessionLocal()
    
    if db.query(models.Admin).count() > 0:
        print("✓ Admin already exists")
        db.close()
        return
    
    print("Creating admin user...")
    admin = models.Admin(
        username="admin",
        email="admin@eswatya.com",
        hashed_password=auth.get_password_hash("admin123"),
        full_name="System Administrator",
        role="admin"
    )
    db.add(admin)
    db.commit()
    print("✓ Admin user created")
    db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Eswatya AI Health Care System")
    print("=" * 50)
    init_database()
    seed_admin()
    seed_doctors()
    generate_time_slots()
    print("\n✅ Complete!")
    print("\nAdmin:")
    print("Username: admin | Password: admin123")
    print("\nDoctors Added (24 total):")
    print("General Physicians: 3 doctors")
    print("Cardiologists: 3 doctors")
    print("Neurologists: 3 doctors")
    print("Dermatologists: 3 doctors")
    print("Pulmonologists: 2 doctors")
    print("Pediatricians: 3 doctors")
    print("Orthopedists: 3 doctors")
    print("Gynecologists: 3 doctors")
    print("\nPassword for all doctors: doctor123")
    print("=" * 50)
