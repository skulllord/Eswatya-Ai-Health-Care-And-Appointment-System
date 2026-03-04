# Debugging Admin Panel Empty Issue

## Problem
Admin panel shows "No doctors found" even though backend has 23 doctors.

## Root Cause
The `/admin/doctors` endpoint requires admin authentication, but the frontend might not be sending the token correctly or the admin login isn't working.

## Quick Fix Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors (red text)
4. Check Network tab for failed API calls

### Step 2: Verify Admin Login
1. Logout if logged in
2. Go to http://localhost:5173/login
3. Select "Admin" as user type
4. Username: `admin`
5. Password: `admin123`
6. Check browser console for any errors

### Step 3: Check Token Storage
1. Open DevTools > Application tab (Chrome) or Storage tab (Firefox)
2. Look at Local Storage
3. Check if `token` and `userType` are stored
4. `userType` should be "admin"

### Step 4: Check Network Requests
1. After login, go to Admin Dashboard
2. Open DevTools > Network tab
3. Look for request to `/admin/doctors`
4. Check if Authorization header is present
5. Check response status (should be 200, not 401 or 403)

## Possible Issues & Solutions

### Issue 1: Token Not Being Sent
**Symptom**: 401 Unauthorized error in console
**Solution**: Check `frontend/src/services/api.js` - token interceptor should add Authorization header

### Issue 2: Admin Login Not Working
**Symptom**: Login fails or redirects incorrectly
**Solution**: Check `backend/auth.py` - admin authentication logic

### Issue 3: CORS Issue
**Symptom**: CORS error in console
**Solution**: Backend needs CORS middleware configured

### Issue 4: Backend Not Running
**Symptom**: Network error, can't connect
**Solution**: Restart backend server

## Manual Test

Run this in browser console after logging in as admin:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'))
console.log('User Type:', localStorage.getItem('userType'))

// Try to fetch doctors
fetch('http://localhost:8000/admin/doctors', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log('Doctors:', data))
.catch(err => console.error('Error:', err))
```

## Expected Behavior
- Login should store token in localStorage
- API calls should include Authorization header
- `/admin/doctors` should return array of 23 doctors
- Frontend should display all doctors

## Files to Check
- `frontend/src/services/api.js` - API configuration
- `frontend/src/context/AuthContext.jsx` - Authentication context
- `frontend/src/pages/LoginPage.jsx` - Login logic
- `backend/main.py` - Admin endpoints
- `backend/auth.py` - Authentication logic
