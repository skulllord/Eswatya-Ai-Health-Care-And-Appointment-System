# Testing Guide - Direct Booking & Specialist Mapping

## Current System Status ✅

- **Backend**: Running on http://localhost:8000 (PID 8256)
- **Frontend**: Running on http://localhost:5173 (PID 468)
- **Database**: SQLite with 23 doctors across 8 specialties
- **All Issues**: FIXED

## What Was Fixed

### 1. Specialist Mapping Issue
- **Before**: Only 3 General Physicians showing for all diseases
- **After**: Correct specialists recommended based on disease type
- **Example**: Heart disease (sinus bradycardia) now shows 3 Cardiologists

### 2. Direct Booking Feature
- **Before**: No way to book appointments without AI prediction
- **After**: New "Find Doctors" page allows direct booking
- **Location**: Prominent blue card on Patient Dashboard

## How to Test

### Test 1: AI Prediction with Correct Specialist (Heart Disease)

1. **Login as Patient**
   - Create new account or use existing patient credentials

2. **Go to AI Prediction**
   - Click "AI Prediction" card on dashboard

3. **Select Heart-Related Symptoms**
   - Search and select: `chest_pain`
   - Search and select: `breathlessness`
   - Search and select: `palpitations`
   - Or search for: `sinus bradycardia` symptoms

4. **Click "Predict Disease"**

5. **Verify Results**
   - ✅ Should show predicted disease
   - ✅ Recommended Specialist should be "Cardiologist" (NOT General Physician)
   - ✅ Should show 3 Cardiologists:
     - Dr. Priya Patel (₹1,200)
     - Dr. Karan Desai (₹1,500)
     - Dr. Meera Nair (₹1,100)

### Test 2: Direct Booking Without AI

1. **Login as Patient**

2. **Go to Find Doctors**
   - Click the blue "Find Doctors" card on dashboard
   - OR click "Find Doctors" in navigation menu

3. **Browse Doctors**
   - ✅ Should see all 23 doctors grouped by specialty
   - ✅ Can search by name, specialty, or qualification
   - ✅ Can filter by specialty using dropdown

4. **Select a Doctor**
   - Click "Book Appointment" on any doctor card
   - Example: Click on Dr. Priya Patel (Cardiologist)

5. **Complete Booking**
   - ✅ Should see doctor information displayed
   - ✅ Select date and time
   - ✅ Optionally add symptoms (comma-separated)
   - ✅ Click "Confirm Booking"

6. **Verify Appointment**
   - ✅ Should see success message
   - ✅ Redirected to "My Appointments"
   - ✅ New appointment should appear in list

### Test 3: Different Specialties

Test that different diseases recommend correct specialists:

| Disease Type | Symptoms to Select | Expected Specialist | Expected Doctors Count |
|--------------|-------------------|---------------------|----------------------|
| Heart Disease | chest_pain, breathlessness | Cardiologist | 3 |
| Skin Issue | skin_rash, itching | Dermatologist | 3 |
| Neurological | headache, dizziness | Neurologist | 3 |
| Respiratory | cough, breathlessness | Pulmonologist | 2 |
| Bone/Joint | joint_pain, stiffness | Orthopedist | 3 |
| Child Health | fever (child) | Pediatrician | 3 |
| Women's Health | menstrual issues | Gynecologist | 3 |
| General | fever, cold | General Physician | 3 |

## Troubleshooting

### Issue: Still Seeing Only 3 General Physicians

**Solution 1: Hard Refresh Browser**
```
Press: Ctrl + Shift + R (Windows/Linux)
Or: Cmd + Shift + R (Mac)
```

**Solution 2: Clear Browser Cache**
1. Open browser DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

**Solution 3: Restart Backend**
```bash
# Stop backend
netstat -ano | findstr :8000
# Note the PID, then:
Stop-Process -Id <PID> -Force

# Start backend
cd backend
python main.py
```

### Issue: Booking Page Not Found

**Solution**: Make sure frontend is running
```bash
cd frontend
npm run dev
```

### Issue: Appointment Not Created

**Check**:
1. Are you logged in as a patient?
2. Did you select a valid date/time?
3. Check browser console for errors (F12)
4. Verify backend is running on port 8000

## API Endpoints to Test Manually

### Get All Doctors
```bash
GET http://localhost:8000/doctors
```

### Get Cardiologists Only
```bash
GET http://localhost:8000/doctors?specialization=Cardiologist
```

### Get General Physicians Only
```bash
GET http://localhost:8000/doctors?specialization=General%20Physician
```

## Doctor Login Credentials (For Testing)

All doctors use password: `doctor123`

### Cardiologists
- Email: `dr.patel@eswatya.com` | Username: `dr_patel`
- Email: `dr.desai@eswatya.com` | Username: `dr_desai`
- Email: `dr.nair@eswatya.com` | Username: `dr_nair`

### General Physicians
- Email: `dr.sharma@eswatya.com` | Username: `dr_sharma`
- Email: `dr.verma@eswatya.com` | Username: `dr_verma`
- Email: `dr.joshi@eswatya.com` | Username: `dr_joshi`

(See DOCTOR_LOGIN_CREDENTIALS.md for complete list)

## Admin Credentials

- Username: `admin`
- Password: `admin123`

## Expected Behavior Summary

### AI Prediction Flow
1. Patient selects symptoms
2. AI predicts disease with confidence score
3. System maps disease to correct specialist
4. Shows doctors of that specialty only
5. Patient books with predicted disease info

### Direct Booking Flow
1. Patient browses all doctors
2. Filters/searches as needed
3. Selects any doctor directly
4. Books appointment without AI prediction
5. Can optionally add symptoms manually

## Success Criteria

✅ Heart disease symptoms recommend Cardiologist (not General Physician)
✅ Shows 3 Cardiologists when Cardiologist is recommended
✅ Find Doctors page shows all 23 doctors
✅ Can book appointments directly from Find Doctors
✅ Both booking methods create appointments successfully
✅ Appointments appear in "My Appointments" page

## Need Help?

If issues persist after following this guide:
1. Check both servers are running (ports 8000 and 5173)
2. Clear browser cache completely
3. Try with a different browser
4. Check browser console for JavaScript errors
5. Check backend terminal for Python errors

All systems are now working correctly! 🎉
