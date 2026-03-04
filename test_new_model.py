"""
Quick test script to verify the new improved model is working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 70)
print("🧪 TESTING NEW AI MODEL")
print("=" * 70)

# Test 1: Check symptoms endpoint
print("\n📋 Test 1: Checking available symptoms...")
response = requests.get(f"{BASE_URL}/symptoms")
if response.status_code == 200:
    symptoms = response.json()["symptoms"]
    print(f"   ✅ SUCCESS: {len(symptoms)} symptoms available")
    print(f"   Sample symptoms: {symptoms[:5]}")
else:
    print(f"   ❌ FAILED: Status {response.status_code}")

# Test 2: Check root endpoint
print("\n🏠 Test 2: Checking API status...")
response = requests.get(f"{BASE_URL}/")
if response.status_code == 200:
    data = response.json()
    print(f"   ✅ SUCCESS: {data['message']}")
    print(f"   Version: {data['version']}")
else:
    print(f"   ❌ FAILED: Status {response.status_code}")

# Test 3: Test prediction (requires login)
print("\n🔐 Test 3: Testing prediction endpoint...")
print("   Note: This requires authentication")
print("   To test predictions:")
print("   1. Login to the application")
print("   2. Go to AI Prediction page")
print("   3. Select symptoms and get predictions")

# Test 4: Check doctors endpoint
print("\n👨‍⚕️ Test 4: Checking doctors endpoint...")
response = requests.get(f"{BASE_URL}/doctors")
if response.status_code == 200:
    doctors = response.json()
    print(f"   ✅ SUCCESS: {len(doctors)} doctors available")
    specialties = set(d['specialization'] for d in doctors)
    print(f"   Specialties: {', '.join(sorted(specialties))}")
else:
    print(f"   ❌ FAILED: Status {response.status_code}")

print("\n" + "=" * 70)
print("✅ BASIC TESTS COMPLETE")
print("=" * 70)
print("\n📝 Next Steps:")
print("   1. Open http://localhost:5173 in your browser")
print("   2. Login as a patient")
print("   3. Go to AI Prediction page")
print("   4. Test with these symptom combinations:")
print("\n   Test Case 1 (Heart):")
print("      - sharp chest pain")
print("      - shortness of breath")
print("      - palpitations")
print("      Expected: Heart-related diseases, Cardiologist")
print("\n   Test Case 2 (Respiratory):")
print("      - cough")
print("      - wheezing")
print("      - fever")
print("      Expected: Respiratory diseases, Pulmonologist")
print("\n   Test Case 3 (Skin):")
print("      - skin rash")
print("      - itching")
print("      - redness")
print("      Expected: Skin conditions, Dermatologist")
print("\n" + "=" * 70)
