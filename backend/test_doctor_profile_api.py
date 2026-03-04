"""
Test doctor profile API endpoint
"""

import requests
import json

API_URL = "http://localhost:8000"

def test_doctor_profile():
    """Test doctor profile endpoint."""
    print("="*60)
    print("Testing Doctor Profile API")
    print("="*60)
    
    # Step 1: Login as doctor
    print("\n1. Logging in as doctor...")
    login_data = {
        "username": "dr.sharma@eswatya.com",
        "password": "doctor123",
        "user_type": "doctor"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            print(f"❌ Login failed: {response.status_code}")
            print(response.json())
            return
        
        data = response.json()
        token = data.get("access_token")
        print(f"✅ Login successful!")
        print(f"Token: {token[:50]}...")
        
        # Step 2: Get doctor profile
        print("\n2. Getting doctor profile...")
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        profile_response = requests.get(
            f"{API_URL}/doctor/profile",
            headers=headers
        )
        
        print(f"Status Code: {profile_response.status_code}")
        
        if profile_response.status_code == 200:
            profile = profile_response.json()
            print(f"✅ Profile retrieved successfully!")
            print(f"\nProfile Data:")
            print(json.dumps(profile, indent=2))
        else:
            print(f"❌ Failed to get profile")
            print(profile_response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend!")
        print("Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_doctor_profile()
