"""Test script to check doctors by specialty in database"""
from database import SessionLocal
import models

db = SessionLocal()

# Get all doctors
all_doctors = db.query(models.Doctor).all()
print(f"\n=== TOTAL DOCTORS: {len(all_doctors)} ===\n")

# Group by specialization
specialties = {}
for doctor in all_doctors:
    spec = doctor.specialization
    if spec not in specialties:
        specialties[spec] = []
    specialties[spec].append(doctor)

# Print by specialty
for spec, doctors in sorted(specialties.items()):
    print(f"\n{spec}: {len(doctors)} doctors")
    print("-" * 50)
    for doc in doctors:
        print(f"  - {doc.full_name} (ID: {doc.id})")
        print(f"    Email: {doc.email}")
        print(f"    Active: {doc.is_active}")
        print(f"    Fee: ₹{doc.consultation_fee}")

# Test filtering like the API does
print("\n\n=== TESTING API FILTER ===")
test_specializations = ["Cardiologist", "General Physician", "Neurologist"]

for spec in test_specializations:
    filtered = db.query(models.Doctor).filter(
        models.Doctor.is_active == True,
        models.Doctor.specialization.ilike(f"%{spec}%")
    ).all()
    print(f"\n{spec}: Found {len(filtered)} doctors")
    for doc in filtered:
        print(f"  - {doc.full_name}")

db.close()
