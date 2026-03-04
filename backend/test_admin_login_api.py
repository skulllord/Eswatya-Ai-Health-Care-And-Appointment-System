"""Test admin login via API"""
import requests
import json

API_URL = "http://localhost:8000"

print("🧪 Testing Admin Login API\n")

# Test data
login_data = {
    "username": "admin",
    "password": "admin123",
    "user_type": "admin"
}

print(f"📤 Sending login request:")
print(f"   URL: {API_URL}/auth/login")
print(f"   Data: {json.dumps(login_data, indent=2)}")
print()

try:
    response = requests.post(
        f"{API_URL}/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"📥 Response Status: {response.status_code}")
    print(f"📥 Response Body:")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 200:
        print("\n✅ Admin login SUCCESSFUL!")
        token = response.json().get("access_token")
        print(f"\n🔑 Access Token: {token[:50]}...")
        
        # Test accessing admin endpoint
        print("\n🧪 Testing admin endpoint access...")
        stats_response = requests.get(
            f"{API_URL}/admin/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"📥 Admin Stats Response: {stats_response.status_code}")
        if stats_response.status_code == 200:
            print("✅ Admin endpoint access SUCCESSFUL!")
            print(json.dumps(stats_response.json(), indent=2))
        else:
            print(f"❌ Admin endpoint access FAILED!")
            print(stats_response.text)
    else:
        print("\n❌ Admin login FAILED!")
        
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Cannot connect to backend server")
    print("   Make sure the backend is running on http://localhost:8000")
except Exception as e:
    print(f"❌ ERROR: {e}")
