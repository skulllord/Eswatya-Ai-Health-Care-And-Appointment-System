"""
Test admin login via API
"""

import requests
import json

API_URL = "http://localhost:8000"

def test_admin_login():
    """Test admin login."""
    print("="*50)
    print("Testing Admin Login API")
    print("="*50)
    
    # Test login
    login_data = {
        "username": "admin",
        "password": "admin123",
        "user_type": "admin"
    }
    
    print(f"\nSending login request...")
    print(f"URL: {API_URL}/auth/login")
    print(f"Data: {json.dumps(login_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{API_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ Login SUCCESSFUL!")
            data = response.json()
            token = data.get("access_token")
            user_type = data.get("user_type")
            
            print(f"Token: {token[:50]}...")
            print(f"User Type: {user_type}")
            
            # Test admin endpoint
            print("\n" + "="*50)
            print("Testing Admin Endpoint with Token")
            print("="*50)
            
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            test_response = requests.get(
                f"{API_URL}/admin/doctors",
                headers=headers
            )
            
            print(f"\nAdmin Doctors Endpoint Status: {test_response.status_code}")
            if test_response.status_code == 200:
                doctors = test_response.json()
                print(f"✅ Success! Found {len(doctors)} doctors")
            else:
                print(f"❌ Failed: {test_response.text}")
        else:
            print(f"\n❌ Login FAILED!")
            print(f"Error: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend!")
        print("Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_admin_login()
