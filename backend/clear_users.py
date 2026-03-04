"""
Script to remove all patient users from the database
Keeps doctors and admin intact
"""

from database import SessionLocal
import models

def clear_users():
    """Remove all patient users from the database."""
    db = SessionLocal()
    
    try:
        # Count current users
        user_count = db.query(models.User).count()
        print(f"Current patient users in database: {user_count}")
        
        if user_count == 0:
            print("✓ No users to delete")
            db.close()
            return
        
        # Delete all appointments first (foreign key constraint)
        appointment_count = db.query(models.Appointment).count()
        if appointment_count > 0:
            db.query(models.Appointment).delete()
            print(f"✓ Deleted {appointment_count} appointments")
        
        # Delete all medical history records
        history_count = db.query(models.MedicalHistory).count()
        if history_count > 0:
            db.query(models.MedicalHistory).delete()
            print(f"✓ Deleted {history_count} medical history records")
        
        # Delete all medications
        medication_count = db.query(models.Medication).count()
        if medication_count > 0:
            db.query(models.Medication).delete()
            print(f"✓ Deleted {medication_count} medication records")
        
        # Delete all payments
        payment_count = db.query(models.Payment).count()
        if payment_count > 0:
            db.query(models.Payment).delete()
            print(f"✓ Deleted {payment_count} payment records")
        
        # Delete all users
        db.query(models.User).delete()
        print(f"✓ Deleted {user_count} patient users")
        
        db.commit()
        
        # Verify deletion
        remaining_users = db.query(models.User).count()
        remaining_doctors = db.query(models.Doctor).count()
        remaining_admins = db.query(models.Admin).count()
        
        print("\n✅ Database cleanup complete!")
        print(f"Remaining patient users: {remaining_users}")
        print(f"Doctors: {remaining_doctors}")
        print(f"Admins: {remaining_admins}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Clearing Patient Users from Database")
    print("=" * 50)
    
    confirm = input("Are you sure you want to delete all patient users? (yes/no): ")
    if confirm.lower() == 'yes':
        clear_users()
    else:
        print("Operation cancelled")
    
    print("=" * 50)
