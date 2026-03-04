"""
Script to add new doctors to existing database
"""

from database import SessionLocal
import models
import auth

def add_new_doctors():
    """Add new doctors to the database."""
    db = SessionLocal()
    
    # Check existing doctors
    existing_count = db.query(models.Doctor).count()
    print(f"Current doctors in database: {existing_count}")
    
    # New doctors to add
    new_doctors = [
        # Additional General Physicians
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
        
        # Additional Cardiologists
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
        
        # Additional Neurologists
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
        
        # Additional Dermatologists
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
        
        # Additional Pulmonologist
        {"username": "dr_rao", "email": "dr.rao@eswatya.com", "password": "doctor123",
         "full_name": "Dr. Deepa Rao", "specialization": "Pulmonologist",
         "qualification": "MBBS, MD, DNB (Pulmonology)", "experience_years": 11, "phone": "+91 98765 43228",
         "consultation_fee": 950.0, "available_days": "Tuesday,Wednesday,Thursday,Friday,Saturday",
         "available_time_start": "09:00", "available_time_end": "17:00",
         "bio": "Specialist in sleep disorders, tuberculosis, and critical care pulmonology."},
        
        # Additional Pediatricians
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
        
        # Additional Orthopedists
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
        
        # Additional Gynecologists
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
    
    added_count = 0
    for d in new_doctors:
        # Check if doctor already exists
        existing = db.query(models.Doctor).filter(models.Doctor.email == d["email"]).first()
        if existing:
            print(f"⚠ Skipping {d['full_name']} - already exists")
            continue
        
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
        added_count += 1
        print(f"✓ Added {d['full_name']} ({d['specialization']})")
    
    db.commit()
    
    final_count = db.query(models.Doctor).count()
    print(f"\n✅ Update complete!")
    print(f"Doctors added: {added_count}")
    print(f"Total doctors: {final_count}")
    
    db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Adding New Doctors to Database")
    print("=" * 50)
    add_new_doctors()
    print("=" * 50)
