# Eswatya AI Health Care System - Complete Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer, set password for postgres user
3. Remember your password!

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE eswatya_healthcare;

# Exit
\q
```

### Step 3: Setup Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Initialize database with sample doctors
python init_db.py

# Start backend server
python main.py
```

✅ Backend running on http://localhost:8000

### Step 4: Setup Frontend

```bash
# Open new terminal
cd frontend

# Install Node dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend running on http://localhost:5173

### Step 5: Test the System

1. Open browser to http://localhost:5173
2. Click "Register"
3. Register as Patient
4. Login with your credentials
5. Go to "AI Prediction"
6. Select symptoms and get prediction!

## Sample Doctor Logins

```
Username: dr_smith
Password: doctor123
Type: Doctor
Specialization: General Physician
```

## Common Issues & Solutions

### Issue: "Database connection failed"

**Solution:**
1. Check PostgreSQL is running
2. Update database URL in `backend/database.py`:
```python
DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/eswatya_healthcare"
```

### Issue: "Module not found" errors

**Solution:**
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: "Cannot connect to backend"

**Solution:**
1. Ensure backend is running on port 8000
2. Check terminal for error messages
3. Verify CORS settings in `backend/main.py`

### Issue: Frontend build errors

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Database Configuration

If you need to change database settings:

**File:** `backend/database.py`

```python
DATABASE_URL = "postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"

# Example:
DATABASE_URL = "postgresql://postgres:mypassword@localhost:5432/eswatya_healthcare"
```

## Environment Variables (Optional)

Create `.env` file in backend directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/eswatya_healthcare
SECRET_KEY=your-secret-key-here
```

## Testing the Complete Flow

### As Patient:
1. Register → Login
2. Go to AI Prediction
3. Select symptoms: fever, cough, headache
4. Click "Predict Disease"
5. View result: "common cold" with confidence score
6. See recommended specialist: "General Physician"
7. View medication suggestions
8. Select appointment date/time
9. Book appointment with Dr. Smith
10. Go to "Appointments" to see status

### As Doctor:
1. Login as dr_smith / doctor123
2. View pending appointments
3. Add consultation notes
4. Approve appointment
5. Mark as completed

## API Documentation

Once backend is running, visit:
- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## Production Deployment

### Backend (Example with Heroku):
```bash
# Add Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy
heroku create eswatya-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Frontend (Example with Vercel):
```bash
# Update API URL in frontend/src/services/api.js
const API_BASE_URL = 'https://your-backend-url.herokuapp.com'

# Deploy
npm run build
vercel deploy
```

## System Requirements

**Minimum:**
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- 4GB RAM
- 2GB free disk space

**Recommended:**
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- 8GB RAM
- 5GB free disk space

## Support

For issues or questions:
1. Check this guide
2. Review README.md
3. Check terminal error messages
4. Verify all services are running

## Next Steps

After successful setup:
1. Explore all features
2. Test with different symptoms
3. Try booking appointments
4. Test doctor dashboard
5. Customize for your needs

---

**Setup Time:** ~5-10 minutes  
**Difficulty:** Beginner-friendly  
**Support:** Comprehensive documentation included
