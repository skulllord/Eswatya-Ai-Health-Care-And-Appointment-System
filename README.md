# Eswatya AI Health Care System

**Academic Research Project**: AI-Enhanced Intelligent Doctor Appointment and Medication Recommendation System

A comprehensive full-stack healthcare management system that leverages artificial intelligence for disease prediction, doctor appointment booking, and medication recommendations.

## 🎯 Project Overview

This system integrates machine learning with modern web technologies to provide:
- AI-powered disease prediction based on symptoms
- Intelligent doctor-patient appointment management
- Automated medication recommendations
- Separate dashboards for patients and doctors
- Secure JWT-based authentication

## 🏗️ System Architecture

### Technology Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication
- Context API for state management

**Backend:**
- FastAPI (Python)
- PostgreSQL database
- SQLAlchemy ORM
- JWT authentication
- Naive Bayes ML model

**Machine Learning:**
- Pre-trained Naive Bayes classifier
- 377 symptom features
- Disease prediction with confidence scores
- Specialist recommendation engine

## 📁 Project Structure

```
eswatya-healthcare/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # Authentication logic
│   ├── database.py             # Database configuration
│   ├── init_db.py              # Database initialization
│   ├── model.pkl               # ML model
│   ├── filtered_top100_dataset.csv
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PredictionPage.jsx
│   │   │   ├── AppointmentsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### 1. Database Setup

```bash
# Install PostgreSQL and create database
createdb eswatya_healthcare

# Or use psql
psql -U postgres
CREATE DATABASE eswatya_healthcare;
\q
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and seed sample doctors
python init_db.py

# Start backend server
python main.py
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📊 Database Schema

### Users Table (Patients)
- id, email, username, hashed_password
- full_name, phone, age, gender, address
- role, created_at

### Doctors Table
- id, email, username, hashed_password
- full_name, specialization, qualification
- experience_years, phone, consultation_fee
- available_days, available_time, is_active

### Appointments Table
- id, patient_id, doctor_id
- appointment_date, symptoms
- predicted_disease, confidence_score
- status, consultation_notes
- created_at, updated_at

### Medical History Table
- id, patient_id, symptoms
- predicted_disease, confidence_score
- recommended_specialist, created_at

### Medications Table
- id, disease_name, medication_name
- dosage, frequency, duration, precautions

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for secure authentication:

- Separate login for patients and doctors
- Token-based session management
- Protected routes with role-based access
- Secure password hashing with bcrypt

## 🤖 AI Features

### Disease Prediction
1. User selects symptoms from 377 available options
2. System converts symptoms to binary feature vector
3. Naive Bayes model predicts disease
4. Returns disease name, confidence score, and recommended specialist

### Specialist Recommendation
Intelligent mapping of diseases to medical specializations:
- Common Cold → General Physician
- Heart conditions → Cardiologist
- Neurological issues → Neurologist
- Skin conditions → Dermatologist
- And 30+ more mappings

### Medication Suggestions
OTC medication recommendations with:
- Medication name
- Dosage information
- Frequency and duration
- Safety precautions
- Medical disclaimer

## 👥 User Roles & Features

### Patient Features
- ✅ Register and login
- ✅ Update profile information
- ✅ Select symptoms and get AI predictions
- ✅ View prediction confidence scores
- ✅ See recommended specialist
- ✅ View medication suggestions
- ✅ Book appointments with doctors
- ✅ View appointment history
- ✅ Track medical history

### Doctor Features
- ✅ Login to dashboard
- ✅ View all appointments
- ✅ Approve/reject appointment requests
- ✅ Add consultation notes
- ✅ Mark appointments as completed
- ✅ View patient symptoms and AI predictions

## 🎨 UI/UX Features

- Clean medical-themed design (blue/white palette)
- Responsive layout for all devices
- Intuitive navigation
- Real-time form validation
- Loading states and error handling
- Professional dashboard interfaces
- Color-coded status indicators

## 📡 API Endpoints

### Authentication
- `POST /auth/register/patient` - Register patient
- `POST /auth/register/doctor` - Register doctor
- `POST /auth/login` - Login (patient/doctor)

### Patient
- `GET /patient/profile` - Get profile
- `PUT /patient/profile` - Update profile
- `GET /medical-history` - Get medical history

### Prediction
- `GET /symptoms` - Get all symptoms
- `POST /predict` - Predict disease

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors?specialization=X` - Filter by specialization

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments` - Get patient appointments
- `GET /doctor/appointments` - Get doctor appointments
- `PUT /doctor/appointment/{id}` - Update appointment

## 🧪 Testing

### Sample Doctor Credentials
```
Username: dr_smith | Password: doctor123 | Specialization: General Physician
Username: dr_johnson | Password: doctor123 | Specialization: Cardiologist
Username: dr_williams | Password: doctor123 | Specialization: Neurologist
Username: dr_brown | Password: doctor123 | Specialization: Dermatologist
Username: dr_davis | Password: doctor123 | Specialization: Pulmonologist
```

### Test Flow
1. Register as a patient
2. Login to patient dashboard
3. Go to AI Prediction page
4. Select symptoms (e.g., fever, cough, headache)
5. Get prediction result
6. View recommended specialist and medications
7. Book appointment with available doctor
8. Login as doctor to approve appointment

## ⚠️ Important Notes

### Medical Disclaimer
This system is designed for academic research and educational purposes only. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

### Database Configuration
Update the database URL in `backend/database.py`:
```python
DATABASE_URL = "postgresql://username:password@localhost:5432/eswatya_healthcare"
```

### CORS Configuration
If deploying to different domains, update CORS settings in `backend/main.py`:
```python
allow_origins=["http://your-frontend-domain.com"]
```

## 🔧 Troubleshooting

### Backend Issues
- **Database connection error**: Check PostgreSQL is running and credentials are correct
- **Model not loading**: Ensure `model.pkl` is in backend directory
- **Import errors**: Verify all dependencies are installed

### Frontend Issues
- **API connection failed**: Ensure backend is running on port 8000
- **CORS errors**: Check CORS configuration in backend
- **Build errors**: Delete `node_modules` and run `npm install` again

## 📈 Future Enhancements

- Admin dashboard for system management
- Real-time notifications
- Video consultation integration
- Prescription management
- Medical report uploads
- Payment gateway integration
- Mobile app version
- Multi-language support

## 📝 Academic Research Context

This project demonstrates:
- Integration of machine learning in healthcare
- Full-stack web development best practices
- RESTful API design
- Database design and normalization
- User authentication and authorization
- Responsive UI/UX design
- Real-world application of AI in medical diagnosis

## 👨‍💻 Development

### Running in Development Mode

Terminal 1 - Backend:
```bash
cd backend
python main.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## 📄 License

This project is developed for academic research purposes.

## 🤝 Contributing

This is an academic project. For improvements or suggestions, please document them in your research notes.

---

**Project Name**: Eswatya AI Health Care System  
**Type**: Academic Research Project  
**Focus**: AI-Enhanced Healthcare Management  
**Status**: Fully Functional Prototype
"# Eswatya-Ai-Health-Care-And-Appointment-System" 
