"""
Script to list all doctor login credentials
"""

from database import SessionLocal
import models

def list_doctors():
    """List all doctors with their login credentials."""
    db = SessionLocal()
    
    try:
        doctors = db.query(models.Doctor).order_by(models.Doctor.specialization, models.Doctor.full_name).all()
        
        print(f"\nTotal Doctors: {len(doctors)}")
        print("\n" + "=" * 80)
        
        current_specialty = None
        for doctor in doctors:
            if current_specialty != doctor.specialization:
                current_specialty = doctor.specialization
                print(f"\n{current_specialty.upper()}")
                print("-" * 80)
            
            print(f"Name: {doctor.full_name}")
            print(f"Email/Username: {doctor.email}")
            print(f"Password: doctor123")
            print(f"Qualification: {doctor.qualification}")
            print(f"Experience: {doctor.experience_years} years")
            print(f"Consultation Fee: ₹{doctor.consultation_fee}")
            print(f"Phone: {doctor.phone}")
            print()
        
        print("=" * 80)
        print("\n📋 QUICK REFERENCE - Doctor Login Credentials:")
        print("-" * 80)
        for doctor in doctors:
            print(f"{doctor.email:<35} | Password: doctor123 | {doctor.specialization}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 80)
    print("ESWATYA HEALTH CARE - DOCTOR LOGIN CREDENTIALS")
    print("=" * 80)
    list_doctors()
