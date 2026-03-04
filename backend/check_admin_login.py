"""Check admin credentials and test login"""
from database import SessionLocal
import models
import auth

db = SessionLocal()

# Check if admin exists
admin = db.query(models.Admin).filter(models.Admin.username == "admin").first()

if admin:
    print("✅ Admin user found in database")
    print(f"   Username: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Full Name: {admin.full_name}")
    print(f"   Role: {admin.role}")
    print(f"   Hashed Password: {admin.hashed_password[:50]}...")
    
    # Test password verification
    print("\n🔐 Testing password verification:")
    test_password = "admin123"
    
    # Try bcrypt verification
    try:
        import bcrypt
        is_valid_bcrypt = bcrypt.checkpw(test_password.encode('utf-8'), admin.hashed_password.encode('utf-8'))
        print(f"   Bcrypt verification: {is_valid_bcrypt}")
    except Exception as e:
        print(f"   Bcrypt verification failed: {e}")
    
    # Try the auth module verification
    is_valid_auth = auth.verify_password(test_password, admin.hashed_password)
    print(f"   Auth module verification: {is_valid_auth}")
    
    if is_valid_auth:
        print("\n✅ Password 'admin123' is CORRECT")
    else:
        print("\n❌ Password 'admin123' is INCORRECT")
        print("\n🔧 Fixing admin password...")
        admin.hashed_password = auth.get_password_hash("admin123")
        db.commit()
        print("✅ Admin password reset to 'admin123'")
        
else:
    print("❌ No admin user found in database")
    print("\n🔧 Creating admin user...")
    
    new_admin = models.Admin(
        email="admin@eswatya.com",
        username="admin",
        hashed_password=auth.get_password_hash("admin123"),
        full_name="System Administrator",
        role="admin"
    )
    
    db.add(new_admin)
    db.commit()
    print("✅ Admin user created successfully")
    print("   Username: admin")
    print("   Password: admin123")

# List all admins
print("\n📋 All admin users:")
all_admins = db.query(models.Admin).all()
for a in all_admins:
    print(f"   - {a.username} ({a.email})")

db.close()
