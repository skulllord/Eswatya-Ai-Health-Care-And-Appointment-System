# Eswatya AI Health Care System - Quick Reference Card

## 🚀 Start Commands

```bash
# Backend (Terminal 1)
cd backend
python main.py

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 👥 Sample Logins

### Doctors (Pre-seeded)
```
Username: dr_smith     | Password: doctor123 | Specialization: General Physician
Username: dr_johnson   | Password: doctor123 | Specialization: Cardiologist
Username: dr_williams  | Password: doctor123 | Specialization: Neurologist
Username: dr_brown     | Password: doctor123 | Specialization: Dermatologist
Username: dr_davis     | Password: doctor123 | Specialization: Pulmonologist
```

### Patient
Register your own account at http://localhost:5173/register

## 📁 Key Files

### Backend
- `backend/main.py` - Main API application
- `backend/models.py` - Database models
- `backend/auth.py` - Authentication
- `backend/init_db.py` - Initialize database

### Frontend
- `frontend/src/App.jsx` - Main app
- `frontend/src/pages/PredictionPage.jsx` - AI prediction
- `frontend/src/services/api.js` - API calls
- `frontend/src/context/AuthContext.jsx` - Auth state

## 🔧 Common Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start server
python main.py

# Check if running
curl http://localhost:8000
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Database
```bash
# Create database
psql -U postgres
CREATE DATABASE eswatya_healthcare;
\q

# Check connection
psql -U postgres -d eswatya_healthcare -c "SELECT 1;"
```

## 🐛 Quick Fixes

### Backend won't start
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
python init_db.py
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database connection error
Update `backend/database.py`:
```python
DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/eswatya_healthcare"
```

### CORS error
Check `backend/main.py` line 30:
```python
allow_origins=["http://localhost:5173"]
```

## 📊 API Endpoints Quick Reference

### Authentication
- `POST /auth/register/patient` - Register patient
- `POST /auth/register/doctor` - Register doctor
- `POST /auth/login` - Login

### Patient
- `GET /patient/profile` - Get profile
- `PUT /patient/profile` - Update profile

### Prediction
- `GET /symptoms` - Get all symptoms (377 total)
- `POST /predict` - Predict disease

### Appointments
- `POST /appointments` - Book appointment
- `GET /appointments` - Get patient appointments
- `GET /doctor/appointments` - Get doctor appointments
- `PUT /doctor/appointment/{id}` - Update appointment

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors?specialization=X` - Filter by specialization

## 🧪 Test Flow

### As Patient
1. Register → http://localhost:5173/register
2. Login → http://localhost:5173/login
3. Dashboard → http://localhost:5173/patient/dashboard
4. AI Prediction → http://localhost:5173/patient/predict
5. Select symptoms: fever, cough, headache
6. Get prediction
7. Book appointment
8. View appointments → http://localhost:5173/patient/appointments

### As Doctor
1. Login → http://localhost:5173/login (use dr_smith / doctor123)
2. Dashboard → http://localhost:5173/doctor/dashboard
3. View appointments
4. Approve/reject
5. Add notes
6. Mark completed

## 📦 Dependencies

### Backend (Python)
```
fastapi
uvicorn
pandas
numpy
scikit-learn
pydantic
sqlalchemy
psycopg2-binary
python-jose[cryptography]
passlib[bcrypt]
python-multipart
```

### Frontend (Node.js)
```
react
react-dom
react-router-dom
axios
tailwindcss
vite
```

## 🔐 Security Notes

- JWT tokens expire after 24 hours
- Passwords hashed with bcrypt
- CORS enabled for localhost:5173
- SQL injection protected (SQLAlchemy ORM)
- Input validation with Pydantic

## 📝 File Locations

### Configuration
- Database: `backend/database.py`
- API CORS: `backend/main.py` (line 30)
- Frontend API URL: `frontend/src/services/api.js` (line 3)

### Data Files
- ML Model: `backend/model.pkl`
- Dataset: `backend/filtered_top100_dataset.csv`

### Styling
- Tailwind Config: `frontend/tailwind.config.js`
- Global CSS: `frontend/src/index.css`

## 🎯 Feature Checklist

- [x] User authentication (JWT)
- [x] Patient registration
- [x] Doctor registration
- [x] AI disease prediction
- [x] Symptom selection (377 symptoms)
- [x] Confidence scoring
- [x] Specialist recommendation
- [x] Medication suggestions
- [x] Appointment booking
- [x] Appointment management
- [x] Medical history
- [x] Profile management
- [x] Responsive design

## 📞 Support

1. Check SETUP_GUIDE.md for detailed setup
2. Check README.md for full documentation
3. Check PROJECT_SUMMARY.md for overview
4. Check terminal for error messages
5. Verify all services are running

## ⚡ Performance Tips

- Use PostgreSQL indexes (already configured)
- Enable database connection pooling
- Use React.memo for expensive components
- Lazy load routes with React.lazy()
- Optimize images and assets

## 🎓 Academic Use

**Project Type:** Full-Stack AI Healthcare System  
**Technologies:** React, FastAPI, PostgreSQL, ML  
**Purpose:** Academic Research & Demonstration  
**Status:** Production-Ready

---

**Quick Start Time:** 5 minutes  
**Full Setup Time:** 10 minutes  
**Difficulty:** Beginner-Friendly
