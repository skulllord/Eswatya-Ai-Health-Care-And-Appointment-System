# Admin Login Guide

## Admin Credentials ✅

**Username**: `admin`  
**Password**: `admin123`  
**Email**: `admin@eswatya.com`

## How to Login as Admin

### Step 1: Go to Login Page
Navigate to: http://localhost:5173/login

### Step 2: Select Admin User Type
Click on the **Admin** option (🔐 icon) in the "Login As" section

### Step 3: Enter Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Step 4: Click Login
You should be redirected to: http://localhost:5173/admin/dashboard

## Verification Status

✅ **Backend API**: Admin login endpoint working correctly  
✅ **Database**: Admin user exists with correct credentials  
✅ **Password Hash**: Verified and working  
✅ **Token Generation**: Working correctly  
✅ **Admin Endpoints**: All accessible with valid token  

## Testing Results

### API Test (Successful)
```bash
POST http://localhost:8000/auth/login
{
  "username": "admin",
  "password": "admin123",
  "user_type": "admin"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_type": "admin"
}
```

### Admin Stats Endpoint (Successful)
```bash
GET http://localhost:8000/admin/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "total_patients": 1,
  "total_doctors": 23,
  "total_appointments": 2,
  "pending_appointments": 1,
  "completed_appointments": 1,
  "total_revenue": 0.0
}
```

## Troubleshooting

### Issue: "Incorrect username or password"

**Solution 1: Clear Browser Cache**
1. Press `Ctrl + Shift + Delete`
2. Clear cached images and files
3. Try logging in again

**Solution 2: Hard Refresh**
1. Press `Ctrl + Shift + R` (Windows/Linux)
2. Or `Cmd + Shift + R` (Mac)

**Solution 3: Try Different Browser**
- Open in incognito/private mode
- Or try a different browser

**Solution 4: Check Backend is Running**
```bash
# Check if backend is running on port 8000
netstat -ano | findstr :8000
```

If not running:
```bash
cd backend
python main.py
```

### Issue: "Cannot connect to server"

**Check Backend Status**:
```bash
# Windows PowerShell
netstat -ano | findstr :8000

# Should show:
# TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING    <PID>
```

**Restart Backend**:
```bash
cd backend
python main.py
```

### Issue: Redirected to wrong page after login

**Check URL**: After successful login, you should be at:
```
http://localhost:5173/admin/dashboard
```

If redirected elsewhere, check browser console (F12) for errors.

## Admin Panel Features

Once logged in, you can access:

### 1. Dashboard (`/admin/dashboard`)
- System statistics
- Total patients, doctors, appointments
- Revenue tracking
- Recent appointments overview

### 2. Manage Doctors (`/admin/doctors`)
- View all 23 doctors
- Add new doctors
- Delete doctors
- View doctor details

### 3. Manage Appointments (`/admin/appointments`)
- View all appointments
- Filter by status (pending, approved, completed, cancelled)
- View appointment details
- Patient and doctor information

### 4. Manage Users (`/admin/users`)
- View all patient users
- Delete users
- View user details

## Test Admin Login (HTML)

A test page has been created at `test_admin_login.html` in the project root.

**To use**:
1. Open `test_admin_login.html` in your browser
2. Click "Test Login" button
3. Should show success message with token and system stats

## Alternative Login Methods

### Method 1: Using Email
- **Email**: `admin@eswatya.com`
- **Password**: `admin123`
- **User Type**: Admin

### Method 2: Using Username (Recommended)
- **Username**: `admin`
- **Password**: `admin123`
- **User Type**: Admin

Both methods work because the backend checks both username and email fields.

## Security Notes

⚠️ **Important**: These are default credentials for development/testing only.

For production:
1. Change the admin password immediately
2. Use strong passwords (minimum 12 characters)
3. Enable two-factor authentication
4. Implement password rotation policy
5. Use environment variables for sensitive data

## Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:8000/
```

### Test Admin Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","user_type":"admin"}'
```

### Test Admin Stats (with token)
```bash
curl http://localhost:8000/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Support

If you still cannot login after trying all troubleshooting steps:

1. Check `backend/check_admin_login.py` output
2. Check browser console (F12) for JavaScript errors
3. Check backend terminal for Python errors
4. Verify both servers are running:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173

## Summary

✅ Admin credentials are correct and verified  
✅ Backend API is working  
✅ Database has admin user  
✅ All admin endpoints are accessible  
✅ Frontend login page has admin option  

**If you're still having issues, please provide**:
1. Screenshot of the error message
2. Browser console errors (F12 → Console tab)
3. Backend terminal output
4. Which browser you're using
