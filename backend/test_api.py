"""
Quick test script to verify the API is working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Health check
print("Testing health check endpoint...")
response = requests.get(f"{BASE_URL}/")
print(f"✓ Status: {response.json()}")

# Test 2: Get symptoms
print("\nTesting symptoms endpoint...")
response = requests.get(f"{BASE_URL}/symptoms")
symptoms = response.json()["symptoms"]
print(f"✓ Loaded {len(symptoms)} symptoms")
print(f"  First 5 symptoms: {symptoms[:5]}")

# Test 3: Predict disease
print("\nTesting prediction endpoint...")
test_symptoms = ["fever", "cough", "headache"]
response = requests.post(
    f"{BASE_URL}/predict",
    json={"symptoms": test_symptoms}
)
result = response.json()
print(f"✓ Prediction successful!")
print(f"  Input symptoms: {test_symptoms}")
print(f"  Predicted disease: {result['predicted_disease']}")
print(f"  Confidence: {result['confidence']*100:.2f}%")

print("\n✅ All tests passed! Backend is working correctly.")
