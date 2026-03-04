"""
Check if admin account exists and verify credentials
"""

from database import SessionLocal
import models
import auth

def check_admin():
    """Check admin account."""
    db = SessionLocal()
    
    try:
        # Check if admin exists
        admin = db.query(models.Admin).filter(models.Admin.username == "admin").first()
        
        if not admin:
            print("❌ Admin account does NOT exist!")
            print("\nCreating admin account...")
            
            # Create admin
            new_admin = models.Admin(
                username="admin",
                email="admin@eswatya.com",
                hashed_password=auth.get_password_hash("admin123"),
                full_name="System Administrator",
                role="admin"
            )
            db.add(new_admin)
            db.commit()
            print("✅ Admin account created!")
        else:
            print("✅ Admin account EXISTS!")
            print(f"Username: {admin.username}")
            print(f"Email: {admin.email}")
            print(f"Full Name: {admin.full_name}")
            print(f"Role: {admin.role}")
        
        # Test password verification
        print("\n" + "="*50)
        print("Testing password verification...")
        print("="*50)
        
        admin = db.query(models.Admin).filter(models.Admin.username == "admin").first()
        test_password = "admin123"
        
        try:
            is_valid = auth.verify_password(test_password, admin.hashed_password)
            if is_valid:
                print(f"✅ Password 'admin123' is CORRECT!")
            else:
                print(f"❌ Password 'admin123' is INCORRECT!")
                print("\nResetting password to 'admin123'...")
                admin.hashed_password = auth.get_password_hash("admin123")
                db.commit()
                print("✅ Password reset complete!")
        except Exception as e:
            print(f"❌ Error verifying password: {e}")
            print("\nResetting password to 'admin123'...")
            admin.hashed_password = auth.get_password_hash("admin123")
            db.commit()
            print("✅ Password reset complete!")
        
        print("\n" + "="*50)
        print("ADMIN LOGIN CREDENTIALS:")
        print("="*50)
        print("Username: admin")
        print("Password: admin123")
        print("User Type: admin")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()
