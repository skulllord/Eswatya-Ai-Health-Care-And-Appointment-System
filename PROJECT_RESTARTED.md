# ✅ Project Restarted Successfully!

## Status

Both backend and frontend servers are now running in separate PowerShell windows.

### Backend Server
- **Status**: ✅ Running
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Window**: Separate PowerShell window (keep it open)

### Frontend Server
- **Status**: ✅ Running
- **URL**: http://localhost:5173
- **Window**: Separate PowerShell window (keep it open)

## How to Access

### Main Application
Open your browser and go to: **http://localhost:5173**

### Login Credentials

#### Admin Login
- **URL**: http://localhost:5173/login
- **User Type**: Admin
- **Username**: `admin`
- **Password**: `admin123`

#### Doctor Login (23 doctors available)
- **URL**: http://localhost:5173/login
- **User Type**: Doctor
- **Email**: Any doctor email (e.g., `dr.sharma@eswatya.com`)
- **Password**: `doctor123`

**All Doctor Emails:**
1. dr.sharma@eswatya.com - Dr. Rajesh Sharma (General Physician)
2. dr.verma@eswatya.com - Dr. Neha Verma (General Physician)
3. dr.joshi@eswatya.com - Dr. Arun Joshi (General Physician)
4. dr.patel@eswatya.com - Dr. Priya Patel (Cardiologist)
5. dr.desai@eswatya.com - Dr. Karan Desai (Cardiologist)
6. dr.nair@eswatya.com - Dr. Meera Nair (Cardiologist)
7. dr.kumar@eswatya.com - Dr. Amit Kumar (Neurologist)
8. dr.banerjee@eswatya.com - Dr. Sanjay Banerjee (Neurologist)
9. dr.chopra@eswatya.com - Dr. Ritu Chopra (Neurologist)
10. dr.singh@eswatya.com - Dr. Anjali Singh (Dermatologist)
11. dr.malhotra@eswatya.com - Dr. Rahul Malhotra (Dermatologist)
12. dr.kapoor@eswatya.com - Dr. Pooja Kapoor (Dermatologist)
13. dr.reddy@eswatya.com - Dr. Srinivas Reddy (Pulmonologist)
14. dr.rao@eswatya.com - Dr. Deepa Rao (Pulmonologist)
15. dr.mehta@eswatya.com - Dr. Kavita Mehta (Pediatrician)
16. dr.agarwal@eswatya.com - Dr. Suresh Agarwal (Pediatrician)
17. dr.bose@eswatya.com - Dr. Ananya Bose (Pediatrician)
18. dr.gupta@eswatya.com - Dr. Vikram Gupta (Orthopedist)
19. dr.saxena@eswatya.com - Dr. Manoj Saxena (Orthopedist)
20. dr.pillai@eswatya.com - Dr. Arjun Pillai (Orthopedist)
21. dr.iyer@eswatya.com - Dr. Lakshmi Iyer (Gynecologist)
22. dr.shah@eswatya.com - Dr. Nisha Shah (Gynecologist)
23. dr.menon@eswatya.com - Dr. Shreya Menon (Gynecologist)

#### Patient Login
- **URL**: http://localhost:5173/register
- **Action**: Register a new patient account
- **User Type**: Patient

## Recent Fixes Applied

✅ Login now accepts both email and username
✅ Doctor profile page fixed (experience_years field)
✅ Admin panel shows all 23 doctors
✅ All appointments and users visible in admin panel
✅ Currency displayed in Indian Rupees (₹) throughout
✅ Find Doctors page integrated with search and filters

## Important Notes

- **Keep both PowerShell windows open** - closing them will stop the servers
- If you need to stop the servers, press `Ctrl+C` in each window
- To restart, run the commands again in each window

## Database

- **Type**: SQLite
- **Location**: `backend/eswatya_healthcare.db`
- **Doctors**: 23 doctors across 8 specialties
- **Admin**: 1 admin account
- **Patients**: 0 (cleared earlier, register new ones)

## Features Available

### Patient Features
- Register and login
- AI disease prediction (377 symptoms)
- Find doctors by specialty
- Book appointments
- View medical history
- Manage profile

### Doctor Features
- Login with email
- View and manage appointments
- Update profile information
- Set availability schedule
- View patient details

### Admin Features
- View system statistics
- Manage all doctors (view, add, delete)
- View all appointments
- Manage all users/patients
- System overview dashboard

## Troubleshooting

If you encounter issues:

1. **Backend not responding**: Check the backend PowerShell window for errors
2. **Frontend not loading**: Check the frontend PowerShell window for errors
3. **Login fails**: Make sure backend is running on port 8000
4. **Page crashes**: Refresh browser with Ctrl+Shift+R

## Next Steps

1. Open http://localhost:5173 in your browser
2. Register as a patient or login as doctor/admin
3. Explore the features!

---

**Project is ready to use! 🎉**
