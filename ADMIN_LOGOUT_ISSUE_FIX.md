## Admin Panel Logout Issue - DIAGNOSIS & FIX

## Issue
- Admin logs in successfully
- Gets redirected but immediately logs out
- Clicking anything in admin panel logs out
- Debug information not showing

## Root Cause
The ProtectedRoute component is not properly recognizing the admin userType, causing it to redirect to login.

## Debugging Steps Added

### 1. Enhanced Logging
Added console.log statements to:
- `AuthContext` - Shows login process and localStorage loading
- `ProtectedRoute` - Shows authentication checks
- All admin-related navigation

### 2. Created Debug Page
New route: `/admin/debug` (no authentication required)

This page shows:
- Current AuthContext state (user, userType, token)
- localStorage values
- Status checks for each value

## How to Debug

### Step 1: Login and Check Console
1. Open browser console (F12)
2. Go to http://localhost:5173/login
3. Login as admin (username: `admin`, password: `admin123`)
4. Watch the console output

**Look for:**
```
Login attempt: {username: "admin", userType: "admin"}
Login response: {access_token: "...", token_type: "bearer", user_type: "admin"}
Login successful, stored: {...}
```

### Step 2: Check Debug Page
After login, manually navigate to:
```
http://localhost:5173/admin/debug
```

This will show you:
- ✅ or ❌ for each required value
- Exact values stored in AuthContext
- Exact values in localStorage

### Step 3: Check ProtectedRoute Logs
When you try to access `/admin/dashboard`, check console for:
```
ProtectedRoute check: {user: {...}, userType: "admin", allowedRole: "admin", loading: false}
```

If you see:
```
No user or userType, redirecting to login
```
or
```
UserType mismatch: undefined !== admin, redirecting to /
```

Then the issue is with how the userType is being stored/retrieved.

## Common Issues & Solutions

### Issue 1: userType is null/undefined

**Symptoms:**
- Console shows: `userType: null` or `userType: undefined`
- ProtectedRoute redirects immediately

**Solution:**
```javascript
// Check localStorage directly in browser console
localStorage.getItem('userType')
// Should return: "admin"

// If it returns null, the login didn't store it properly
```

**Fix:**
1. Clear all localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Hard refresh (Ctrl+Shift+R)
3. Login again

### Issue 2: userType stored as wrong value

**Symptoms:**
- Console shows: `userType: "patient"` or `userType: "doctor"`
- You logged in as admin but it thinks you're something else

**Solution:**
1. Logout completely
2. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Close and reopen browser
4. Login as admin again

### Issue 3: Token not being sent

**Symptoms:**
- API calls return 401 Unauthorized
- Dashboard loads but shows no data

**Solution:**
Check if token is in localStorage:
```javascript
localStorage.getItem('token')
```

If null, login again. If present but API still fails, token might be expired.

## Manual Testing Commands

### In Browser Console (F12)

```javascript
// Check all stored values
console.log('Token:', localStorage.getItem('token'))
console.log('UserType:', localStorage.getItem('userType'))
console.log('User:', localStorage.getItem('user'))

// Clear everything and start fresh
localStorage.clear()
location.reload()

// After login, verify values
console.log('After login:')
console.log('UserType:', localStorage.getItem('userType'))
console.log('Should be: "admin"')
```

## Expected Console Output

### On Login
```
Login attempt: {username: "admin", userType: "admin"}
Login response: {access_token: "eyJ...", token_type: "bearer", user_type: "admin"}
Login successful, stored: {token: "eyJ...", userType: "admin", user: {...}}
```

### On Page Load
```
AuthContext: Loading from localStorage...
Stored values: {token: "eyJ...", userType: "admin", user: "{"username":"admin",...}"}
AuthContext: User restored from localStorage
```

### On Protected Route Access
```
ProtectedRoute check: {user: {username: "admin", userType: "admin"}, userType: "admin", allowedRole: "admin", loading: false}
```

## Quick Fix Steps

1. **Clear Everything**
   ```javascript
   // In browser console
   localStorage.clear()
   sessionStorage.clear()
   ```

2. **Hard Refresh**
   - Press `Ctrl + Shift + R`

3. **Close and Reopen Browser**
   - Completely close the browser
   - Reopen and go to http://localhost:5173/login

4. **Login Fresh**
   - Username: `admin`
   - Password: `admin123`
   - User Type: Admin (🔐)

5. **Check Debug Page**
   - Go to: http://localhost:5173/admin/debug
   - Verify all values are correct

6. **Try Dashboard**
   - Click "Go to Dashboard" button
   - Should work now

## Files Modified

- `frontend/src/App.jsx` - Added logging to ProtectedRoute
- `frontend/src/context/AuthContext.jsx` - Added logging to login and useEffect
- `frontend/src/pages/AdminDebugPage.jsx` - NEW debug page

## Next Steps

1. Clear localStorage completely
2. Hard refresh browser
3. Login as admin
4. Open console (F12) and watch the logs
5. Navigate to `/admin/debug` to see exact state
6. Share console output if still having issues

The debug page and console logs will tell us exactly what's going wrong!
