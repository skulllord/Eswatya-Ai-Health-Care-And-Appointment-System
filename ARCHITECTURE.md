# Eswatya AI Health Care System - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    http://localhost:5173                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Landing    │  │    Login     │  │   Register   │        │
│  │     Page     │  │     Page     │  │     Page     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              PATIENT DASHBOARD                           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │ AI Predict  │ │Appointments │ │   Profile   │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              DOCTOR DASHBOARD                            │ │
│  │  ┌─────────────────────────────────────────────────────┐│ │
│  │  │  View & Manage Appointments                         ││ │
│  │  │  Approve/Reject | Add Notes | Mark Complete        ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ Axios API Calls
                              │ JWT Token Auth
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                            │
│                   http://localhost:8000                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                  API ENDPOINTS                           │ │
│  │                                                          │ │
│  │  Authentication:                                         │ │
│  │  • POST /auth/register/patient                          │ │
│  │  • POST /auth/register/doctor                           │ │
│  │  • POST /auth/login                                     │ │
│  │                                                          │ │
│  │  Patient:                                               │ │
│  │  • GET /patient/profile                                 │ │
│  │  • PUT /patient/profile                                 │ │
│  │  • GET /medical-history                                 │ │
│  │                                                          │ │
│  │  AI Prediction:                                         │ │
│  │  • GET /symptoms                                        │ │
│  │  • POST /predict                                        │ │
│  │                                                          │ │
│  │  Appointments:                                          │ │
│  │  • POST /appointments                                   │ │
│  │  • GET /appointments                                    │ │
│  │  • GET /doctor/appointments                             │ │
│  │  • PUT /doctor/appointment/{id}                         │ │
│  │                                                          │ │
│  │  Doctors:                                               │ │
│  │  • GET /doctors                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              BUSINESS LOGIC LAYER                        │ │
│  │                                                          │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │ │
│  │  │    Auth    │  │  Schemas   │  │   Models   │       │ │
│  │  │  (JWT)     │  │ (Pydantic) │  │(SQLAlchemy)│       │ │
│  │  └────────────┘  └────────────┘  └────────────┘       │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         AI PREDICTION ENGINE                     │  │ │
│  │  │                                                  │  │ │
│  │  │  1. Receive symptoms array                      │  │ │
│  │  │  2. Convert to binary vector [0,1,0,1,...]     │  │ │
│  │  │  3. Load Naive Bayes model (model.pkl)         │  │ │
│  │  │  4. Predict disease                             │  │ │
│  │  │  5. Calculate confidence (predict_proba)        │  │ │
│  │  │  6. Map to specialist                           │  │ │
│  │  │  7. Suggest medications                         │  │ │
│  │  │  8. Save to medical history                     │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQLAlchemy ORM
                              │ psycopg2
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Users     │  │   Doctors    │  │ Appointments │        │
│  │  (Patients)  │  │              │  │              │        │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤        │
│  │ id           │  │ id           │  │ id           │        │
│  │ username     │  │ username     │  │ patient_id   │        │
│  │ email        │  │ email        │  │ doctor_id    │        │
│  │ password     │  │ password     │  │ date         │        │
│  │ full_name    │  │ full_name    │  │ symptoms     │        │
│  │ phone        │  │ specializ.   │  │ disease      │        │
│  │ age          │  │ qualific.    │  │ confidence   │        │
│  │ gender       │  │ experience   │  │ status       │        │
│  │ address      │  │ fee          │  │ notes        │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │   Medical    │  │ Medications  │                           │
│  │   History    │  │              │                           │
│  ├──────────────┤  ├──────────────┤                           │
│  │ id           │  │ id           │                           │
│  │ patient_id   │  │ disease_name │                           │
│  │ symptoms     │  │ medication   │                           │
│  │ disease      │  │ dosage       │                           │
│  │ confidence   │  │ frequency    │                           │
│  │ specialist   │  │ duration     │                           │
│  │ created_at   │  │ precautions  │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow

```
User → Register Page → Enter Details → Submit
                                         │
                                         ▼
                              POST /auth/register/patient
                                         │
                                         ▼
                              Validate Input (Pydantic)
                                         │
                                         ▼
                              Check Username/Email Exists
                                         │
                                         ▼
                              Hash Password (bcrypt)
                                         │
                                         ▼
                              Create User Record (SQLAlchemy)
                                         │
                                         ▼
                              Save to Database (PostgreSQL)
                                         │
                                         ▼
                              Return User Object
                                         │
                                         ▼
                              Redirect to Login Page
```

### 2. Login & Authentication Flow

```
User → Login Page → Enter Credentials → Submit
                                          │
                                          ▼
                               POST /auth/login
                                          │
                                          ▼
                               Find User in Database
                                          │
                                          ▼
                               Verify Password (bcrypt)
                                          │
                                          ▼
                               Generate JWT Token
                                          │
                                          ▼
                               Return Token + User Type
                                          │
                                          ▼
                               Store in localStorage
                                          │
                                          ▼
                               Redirect to Dashboard
                                          │
                                          ▼
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
            Patient Dashboard                          Doctor Dashboard
```

### 3. AI Disease Prediction Flow

```
Patient → Prediction Page → Search Symptoms
                                    │
                                    ▼
                          Select Multiple Symptoms
                                    │
                                    ▼
                          Click "Predict Disease"
                                    │
                                    ▼
                          POST /predict
                          {symptoms: ["fever", "cough"]}
                                    │
                                    ▼
                          Backend Receives Request
                                    │
                                    ▼
                          Load Feature Columns (377)
                                    │
                                    ▼
                          Create Binary Vector
                          [0,1,0,1,0,0,1,...]
                                    │
                                    ▼
                          Load ML Model (model.pkl)
                                    │
                                    ▼
                          model.predict(vector)
                                    │
                                    ▼
                          Get Disease Name
                                    │
                                    ▼
                          model.predict_proba(vector)
                                    │
                                    ▼
                          Calculate Confidence Score
                                    │
                                    ▼
                          Map Disease → Specialist
                          (SPECIALIST_MAPPING)
                                    │
                                    ▼
                          Get Medications
                          (MEDICATION_DATABASE)
                                    │
                                    ▼
                          Save to Medical History
                                    │
                                    ▼
                          Return JSON Response
                          {
                            disease: "common cold",
                            confidence: 0.9999,
                            specialist: "General Physician",
                            medications: [...]
                          }
                                    │
                                    ▼
                          Display Results to User
                                    │
                                    ▼
                          Show Available Doctors
                                    │
                                    ▼
                          Book Appointment Option
```

### 4. Appointment Booking Flow

```
Patient → View Prediction Result → Select Doctor
                                         │
                                         ▼
                              Choose Date & Time
                                         │
                                         ▼
                              Click "Book Appointment"
                                         │
                                         ▼
                              POST /appointments
                              {
                                doctor_id: 1,
                                date: "2024-01-15 10:00",
                                symptoms: [...],
                                disease: "common cold",
                                confidence: 0.99
                              }
                                         │
                                         ▼
                              Verify Doctor Exists
                                         │
                                         ▼
                              Create Appointment Record
                              status: "pending"
                                         │
                                         ▼
                              Save to Database
                                         │
                                         ▼
                              Return Appointment Object
                                         │
                                         ▼
                              Show Success Message
                                         │
                                         ▼
                              Redirect to Appointments Page
```

### 5. Doctor Appointment Management Flow

```
Doctor → Login → Dashboard → View Appointments
                                    │
                                    ▼
                          GET /doctor/appointments
                                    │
                                    ▼
                          Fetch All Appointments
                          WHERE doctor_id = current_doctor
                                    │
                                    ▼
                          Display List with Patient Info
                                    │
                                    ▼
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            Pending Appointments          Approved Appointments
                    │                               │
                    ▼                               ▼
            Add Consultation Notes          Mark as Completed
                    │                               │
                    ▼                               ▼
            Approve or Reject              Update Status
                    │                               │
                    ▼                               ▼
            PUT /doctor/appointment/{id}
            {
              status: "approved",
              notes: "..."
            }
                    │
                    ▼
            Update Database
                    │
                    ▼
            Refresh Appointment List
```

## Technology Stack Details

### Frontend Architecture

```
React Application
├── Router (react-router-dom)
│   ├── Public Routes
│   │   ├── Landing Page
│   │   ├── Login Page
│   │   └── Register Page
│   └── Protected Routes
│       ├── Patient Routes (role: patient)
│       │   ├── Dashboard
│       │   ├── Prediction
│       │   ├── Appointments
│       │   └── Profile
│       └── Doctor Routes (role: doctor)
│           └── Dashboard
│
├── Context (State Management)
│   └── AuthContext
│       ├── user
│       ├── userType
│       ├── token
│       ├── login()
│       ├── logout()
│       └── register()
│
├── Services (API Layer)
│   └── api.js
│       ├── Axios Instance
│       ├── Request Interceptor (Add JWT)
│       └── API Functions
│
├── Components
│   └── Navbar
│       ├── Navigation Links
│       └── Logout Button
│
└── Styling
    └── Tailwind CSS
        ├── Utility Classes
        ├── Custom Theme
        └── Responsive Design
```

### Backend Architecture

```
FastAPI Application
├── Main App (main.py)
│   ├── CORS Middleware
│   ├── Route Handlers
│   └── ML Model Loading
│
├── Database Layer
│   ├── database.py (Connection)
│   ├── models.py (ORM Models)
│   └── SQLAlchemy Engine
│
├── Authentication
│   ├── auth.py
│   ├── JWT Token Generation
│   ├── Password Hashing
│   └── User Verification
│
├── Validation Layer
│   └── schemas.py (Pydantic)
│       ├── Request Models
│       └── Response Models
│
├── AI Engine
│   ├── model.pkl (Naive Bayes)
│   ├── dataset.csv (Features)
│   ├── Prediction Logic
│   └── Specialist Mapping
│
└── Business Logic
    ├── User Management
    ├── Appointment Management
    ├── Medical History
    └── Doctor Management
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│                                         │
│  1. HTTPS (Production)                  │
│     └─ Encrypted Communication          │
│                                         │
│  2. CORS Protection                     │
│     └─ Allowed Origins Only             │
│                                         │
│  3. JWT Authentication                  │
│     ├─ Token Expiration (24h)          │
│     ├─ Signature Verification           │
│     └─ User Type Validation             │
│                                         │
│  4. Password Security                   │
│     ├─ Bcrypt Hashing                   │
│     ├─ Salt Generation                  │
│     └─ No Plain Text Storage            │
│                                         │
│  5. Input Validation                    │
│     ├─ Pydantic Schemas                 │
│     ├─ Type Checking                    │
│     └─ SQL Injection Prevention         │
│                                         │
│  6. Role-Based Access                   │
│     ├─ Patient Routes                   │
│     ├─ Doctor Routes                    │
│     └─ Protected Endpoints              │
│                                         │
└─────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────┐
│                    CDN / Edge Network                   │
│                  (Static Assets Caching)                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend (Vercel / Netlify)                │
│                   React Production Build                │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTPS API Calls
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│           Backend (Heroku / AWS / DigitalOcean)         │
│                    FastAPI + Uvicorn                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ PostgreSQL Connection
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│         Database (Heroku Postgres / AWS RDS)            │
│                    PostgreSQL 14+                       │
└─────────────────────────────────────────────────────────┘
```

---

**Architecture Type:** Microservices-Ready Monolith  
**Scalability:** Horizontal (Stateless API)  
**Database:** Relational (PostgreSQL)  
**Authentication:** JWT (Stateless)  
**API Style:** RESTful
