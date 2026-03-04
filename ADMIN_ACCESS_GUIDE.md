# Admin Panel Access Guide

## How to Access the Admin Panel

### Step 1: Make sure the backend and frontend are running

**Backend:**
```bash
cd backend
python -m uvicorn main:app --reload
```
Backend should be running on: http://localhost:8000

**Frontend:**
```bash
cd frontend
npm run dev
```
Frontend should be running on: http://localhost:5173

### Step 2: Login as Admin

1. Open your browser and go to: http://localhost:5173/login
2. Select "Admin" as the user type (radio button)
3. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
4. Click "Login"

### Step 3: You're in!

After successful login, you'll be redirected to: http://localhost:5173/admin/dashboard

## Admin Dashboard Features

The admin dashboard shows:

✅ **Statistics Cards:**
- Total Patients
- Total Doctors  
- Total Appointments
- Total Revenue (in ₹)

✅ **Quick Actions:**
- View All Appointments (link to /admin/appointments)
- Manage Doctors (link to /admin/doctors)
- Add New Doctor (link to /admin/add-doctor)

✅ **Recent Appointments Table:**
- Shows last 5 appointments with patient name, doctor name, date, status, and payment status

✅ **Registered Doctors:**
- Shows first 6 doctors with their specialization, qualification, and consultation fee

## Admin Credentials

- **Username:** admin
- **Password:** admin123
- **Email:** admin@eswatya.com

## Note

The admin panel pages for viewing all appointments, managing doctors, and adding new doctors are referenced in the dashboard but need to be created. The backend API endpoints are ready:

- `GET /admin/stats` - System statistics
- `GET /admin/appointments` - All appointments
- `GET /admin/doctors` - All doctors
- `POST /admin/doctors` - Add new doctor
- `DELETE /admin/doctors/{doctor_id}` - Remove doctor

## Troubleshooting

If you can't login:
1. Make sure you ran `python init_db.py` in the backend folder
2. Check that the database file `eswatya_healthcare.db` exists in the backend folder
3. Verify the backend is running without errors
4. Check browser console for any errors
