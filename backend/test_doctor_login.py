"""
Test doctor login
"""

from database import SessionLocal
import models
import auth

def test_doctor_login():
    """Test doctor login credentials."""
    db = SessionLocal()
    
    print("="*60)
    print("TESTING DOCTOR LOGIN CREDENTIALS")
    print("="*60)
    
    # Test a few doctors
    test_doctors = [
        ("dr.sharma@eswatya.com", "Dr. Rajesh Sharma"),
        ("dr.patel@eswatya.com", "Dr. Priya Patel"),
        ("dr.kumar@eswatya.com", "Dr. Amit Kumar"),
    ]
    
    for email, name in test_doctors:
        print(f"\nTesting: {name} ({email})")
        print("-" * 60)
        
        # Check if doctor exists
        doctor = db.query(models.Doctor).filter(models.Doctor.email == email).first()
        
        if not doctor:
            print(f"❌ Doctor NOT FOUND in database!")
            continue
        
        print(f"✅ Doctor found in database")
        print(f"   Username: {doctor.username}")
        print(f"   Email: {doctor.email}")
        print(f"   Full Name: {doctor.full_name}")
        print(f"   Specialization: {doctor.specialization}")
        
        # Test password
        test_password = "doctor123"
        try:
            is_valid = auth.verify_password(test_password, doctor.hashed_password)
            if is_valid:
                print(f"✅ Password 'doctor123' is CORRECT!")
            else:
                print(f"❌ Password 'doctor123' is INCORRECT!")
                print(f"   Resetting password...")
                doctor.hashed_password = auth.get_password_hash("doctor123")
                db.commit()
                print(f"✅ Password reset to 'doctor123'")
        except Exception as e:
            print(f"❌ Error verifying password: {e}")
            print(f"   Resetting password...")
            doctor.hashed_password = auth.get_password_hash("doctor123")
            db.commit()
            print(f"✅ Password reset to 'doctor123'")
    
    # Count total doctors
    total_doctors = db.query(models.Doctor).count()
    print("\n" + "="*60)
    print(f"Total doctors in database: {total_doctors}")
    print("="*60)
    
    print("\n📋 HOW TO LOGIN AS DOCTOR:")
    print("-" * 60)
    print("1. Go to http://localhost:5173/login")
    print("2. Select 'Doctor' as User Type")
    print("3. Enter email (e.g., dr.sharma@eswatya.com)")
    print("4. Enter password: doctor123")
    print("5. Click Login")
    print("="*60)
    
    db.close()

if __name__ == "__main__":
    test_doctor_login()
