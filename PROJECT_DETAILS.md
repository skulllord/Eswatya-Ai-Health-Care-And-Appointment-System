# Eswatya AI Health Care System - Complete Project Details

## 🤖 AI Features

### 1. Disease Prediction System
**Technology**: Naive Bayes Machine Learning Model

**How It Works**:
- **Input**: Patient selects symptoms from 377 available symptoms
- **Processing**: ML model analyzes symptom combinations
- **Output**: 
  - Predicted disease name
  - Confidence score (0-100%)
  - Recommended specialist type
  - Suggested OTC medications (when available)

**Model Details**:
- **Algorithm**: Naive Bayes Classifier
- **Training Data**: `filtered_top100_dataset.csv` (100 diseases)
- **Model File**: `backend/model.pkl` (pre-trained)
- **Features**: 377 binary symptom indicators
- **Accuracy**: Provides confidence score with each prediction

**Example Flow**:
```
User selects: chest_pain, breathlessness, palpitations
↓
AI Model processes symptom combination
↓
Prediction: "Sinus Bradycardia" (Confidence: 87.5%)
↓
Recommended Specialist: "Cardiologist"
↓
Shows 3 available Cardiologists
```

### 2. Intelligent Specialist Mapping
**Purpose**: Maps predicted diseases to appropriate medical specialists

**Mapping Categories**:
- **Cardiology**: Heart diseases, hypertension, arrhythmia
- **Neurology**: Stroke, migraine, paralysis, epilepsy
- **Pulmonology**: Pneumonia, asthma, bronchitis, COPD
- **Dermatology**: Skin infections, acne, psoriasis
- **Orthopedics**: Arthritis, fractures, joint pain
- **Pediatrics**: Childhood diseases (chickenpox, measles)
- **Gynecology**: PCOS, endometriosis, pregnancy
- **General Physician**: Common ailments, fever, diabetes

**Smart Fallback System**:
- If disease not in mapping, uses keyword detection
- Searches disease name for specialty-related terms
- Example: "cardiac" → Cardiologist, "neuro" → Neurologist

**Code Location**: `backend/main.py` (SPECIALIST_MAPPING dictionary)

### 3. Symptom Search & Selection
**Features**:
- Real-time fuzzy search across 377 symptoms
- Auto-complete suggestions
- Multi-select capability
- Visual symptom tags with remove option
- Prevents duplicate selections

**User Experience**:
- Type to search symptoms
- Click to add to selection
- Shows count of selected symptoms
- Can remove individual symptoms
- Minimum 1 symptom required for prediction

---

## 📅 Appointment System

### 1. Appointment Booking Methods

#### Method A: AI-Powered Booking
**Flow**:
1. Patient selects symptoms
2. AI predicts disease
3. System recommends specialist
4. Shows filtered doctors by specialty
5. Patient selects doctor and time
6. Appointment created with prediction data

**Data Stored**:
- Patient ID
- Doctor ID
- Appointment date/time
- Symptoms (JSON array)
- Predicted disease
- Confidence score
- Status (pending/approved/completed/cancelled)
- Payment status

#### Method B: Direct Booking
**Flow**:
1. Patient browses "Find Doctors" page
2. Filters by specialty or searches
3. Selects any doctor
4. Chooses date/time
5. Optionally adds symptoms
6. Appointment created without AI prediction

**Data Stored**:
- Patient ID
- Doctor ID
- Appointment date/time
- Symptoms (optional, manual entry)
- Predicted disease: "Direct Booking"
- Confidence score: 1.0
- Status and payment status

### 2. Appointment Management

#### For Patients
- **View Appointments**: See all past and upcoming appointments
- **Appointment Details**: Doctor name, specialty, date, status
- **Status Tracking**: pending → approved → completed
- **Payment Status**: unpaid → paid

#### For Doctors
- **Dashboard**: View all appointments assigned to them
- **Update Status**: Change appointment status
- **Add Notes**: Consultation notes for each appointment
- **Patient History**: View patient's medical history

#### For Admins
- **View All**: See all appointments across the system
- **Filter**: By status, date, doctor, patient
- **Statistics**: Total, pending, completed counts
- **Management**: Can view details and monitor system

### 3. Appointment Statuses
- **Pending**: Newly created, awaiting doctor approval
- **Approved**: Doctor confirmed the appointment
- **Completed**: Consultation finished
- **Cancelled**: Appointment cancelled by patient or doctor

### 4. Time Slot System
**Features**:
- Doctors have available days (e.g., "Monday,Wednesday,Friday")
- Doctors have time ranges (e.g., "09:00" to "17:00")
- 30-minute slot intervals
- Slots generated for next 7 days
- Prevents double-booking

**Database Table**: `doctor_time_slots`
- Tracks each 30-minute slot
- Marks slots as booked/available
- Links to appointments

---

## 🎯 Smart Features

### 1. Multi-User Role System
**Three User Types**:

#### Patient
- Register and login
- AI disease prediction
- Browse and book doctors
- View appointment history
- Update profile
- View medical history

#### Doctor
- Login with credentials
- View assigned appointments
- Update appointment status
- Add consultation notes
- Update profile (fees, availability, bio)
- View patient details

#### Admin
- Full system access
- View system statistics
- Manage all users (patients)
- Manage all doctors (add/delete)
- View all appointments
- Monitor system health

### 2. Smart Search & Filter
**Find Doctors Page**:
- Search by name, specialty, or qualification
- Filter by specialty dropdown
- Quick filter by specialty cards
- Shows doctor count per specialty
- Real-time filtering

**Symptom Search**:
- Fuzzy search across 377 symptoms
- Shows top 10 matches
- Filters out already selected symptoms
- Case-insensitive search

### 3. Intelligent UI/UX

#### Responsive Design
- Mobile-friendly layouts
- Tailwind CSS for styling
- Gradient backgrounds
- Smooth animations and transitions
- Hover effects

#### Visual Feedback
- Loading spinners during API calls
- Success/error messages
- Status badges with colors
- Progress indicators
- Confidence score visualization

#### Navigation
- Role-based navigation menus
- Breadcrumb trails
- Quick action cards
- Prominent CTAs (Call-to-Actions)

### 4. Payment Integration (Structure Ready)
**Current Implementation**:
- Payment model in database
- Payment status tracking
- Consultation fees in Indian Rupees (₹)
- Payment endpoint ready

**Ready for Integration**:
- Razorpay
- Stripe
- PayPal
- UPI payments

### 5. Medical History Tracking
**Features**:
- Stores all AI predictions
- Links to patient profile
- Shows symptoms, disease, confidence
- Recommended specialist recorded
- Timestamp for each prediction
- Accessible to patient and doctors

### 6. Security Features
**Authentication**:
- JWT (JSON Web Token) based
- Token stored in localStorage
- Bearer token in API requests
- Token expiration handling

**Password Security**:
- Bcrypt hashing with SHA256 fallback
- Passwords never stored in plain text
- Secure password verification

**Authorization**:
- Role-based access control (RBAC)
- Protected routes for each user type
- API endpoint protection
- Admin-only endpoints secured

---

## 🗄️ Database Schema

### Technology
- **Database**: SQLite (file-based)
- **ORM**: SQLAlchemy
- **File**: `backend/eswatya_healthcare.db`

### Tables & Relationships

#### 1. Users (Patients)
```sql
Table: users
- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- phone
- age
- gender
- address
- profile_photo
- role (default: "patient")
- is_active (default: True)
- created_at (Timestamp)
```

**Relationships**:
- One-to-Many with Appointments
- One-to-Many with Medical History
- One-to-Many with Payments

#### 2. Doctors
```sql
Table: doctors
- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- specialization
- qualification
- experience_years
- phone
- consultation_fee (in ₹)
- available_days (comma-separated)
- available_time_start
- available_time_end
- profile_photo
- bio
- is_active (default: True)
- created_at (Timestamp)
```

**Relationships**:
- One-to-Many with Appointments
- One-to-Many with Time Slots

**Current Data**: 23 doctors across 8 specialties

#### 3. Admins
```sql
Table: admins
- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- role (default: "admin")
- created_at (Timestamp)
```

**Current Data**: 1 admin (username: admin)

#### 4. Appointments
```sql
Table: appointments
- id (Primary Key)
- patient_id (Foreign Key → users.id)
- doctor_id (Foreign Key → doctors.id)
- appointment_date (DateTime)
- symptoms (JSON string)
- predicted_disease
- confidence_score
- status (pending/approved/completed/cancelled)
- payment_status (unpaid/paid)
- consultation_notes
- created_at (Timestamp)
```

**Relationships**:
- Many-to-One with Users (patient)
- Many-to-One with Doctors
- One-to-One with Payments

#### 5. Medical History
```sql
Table: medical_history
- id (Primary Key)
- patient_id (Foreign Key → users.id)
- symptoms (JSON string)
- predicted_disease
- confidence_score
- recommended_specialist
- created_at (Timestamp)
```

**Purpose**: Tracks all AI predictions for each patient

#### 6. Medications
```sql
Table: medications
- id (Primary Key)
- appointment_id (Foreign Key → appointments.id)
- medication_name
- dosage
- frequency
- duration
- instructions
- created_at (Timestamp)
```

**Purpose**: Prescriptions linked to appointments

#### 7. Payments
```sql
Table: payments
- id (Primary Key)
- appointment_id (Foreign Key → appointments.id)
- patient_id (Foreign Key → users.id)
- amount
- currency (default: "INR")
- payment_method
- transaction_id
- status (pending/completed/failed)
- payment_date (DateTime)
- created_at (Timestamp)
```

#### 8. Doctor Time Slots
```sql
Table: doctor_time_slots
- id (Primary Key)
- doctor_id (Foreign Key → doctors.id)
- date (Date)
- time_slot (String, e.g., "09:00-09:30")
- is_booked (Boolean)
- appointment_id (Foreign Key, nullable)
- created_at (Timestamp)
```

**Purpose**: Manages doctor availability and prevents double-booking

---

## 🔄 Application Flow

### 1. Patient Journey - AI Prediction Flow

```
START
  ↓
[Patient Registers/Logs In]
  ↓
[Patient Dashboard]
  ↓
[Clicks "AI Prediction"]
  ↓
[Symptom Selection Page]
  ↓
[Searches and selects symptoms]
  ↓
[Clicks "Predict Disease"]
  ↓
[Backend: ML Model processes symptoms]
  ↓
[Backend: Maps disease to specialist]
  ↓
[Backend: Queries doctors by specialty]
  ↓
[Frontend: Shows prediction results]
  - Disease name
  - Confidence score
  - Recommended specialist
  - List of available doctors
  ↓
[Patient selects doctor and date/time]
  ↓
[Clicks "Book Appointment"]
  ↓
[Backend: Creates appointment record]
  ↓
[Backend: Creates medical history record]
  ↓
[Frontend: Shows success message]
  ↓
[Redirects to "My Appointments"]
  ↓
END
```

### 2. Patient Journey - Direct Booking Flow

```
START
  ↓
[Patient Logs In]
  ↓
[Patient Dashboard]
  ↓
[Clicks "Find Doctors"]
  ↓
[Browse Doctors Page]
  - View all 23 doctors
  - Filter by specialty
  - Search by name
  ↓
[Clicks "Book Appointment" on doctor card]
  ↓
[Booking Page]
  - Shows doctor details
  - Date/time picker
  - Optional symptoms field
  ↓
[Selects date/time]
  ↓
[Clicks "Confirm Booking"]
  ↓
[Backend: Creates appointment]
  - predicted_disease: "Direct Booking"
  - confidence_score: 1.0
  ↓
[Frontend: Success message]
  ↓
[Redirects to "My Appointments"]
  ↓
END
```

### 3. Doctor Journey

```
START
  ↓
[Doctor Logs In]
  ↓
[Doctor Dashboard]
  - View assigned appointments
  - Statistics (total, pending, completed)
  ↓
[Clicks on appointment]
  ↓
[Appointment Details]
  - Patient name and info
  - Symptoms
  - Predicted disease
  - Appointment date
  ↓
[Updates appointment status]
  - Pending → Approved
  - Approved → Completed
  ↓
[Adds consultation notes]
  ↓
[Saves changes]
  ↓
[Backend: Updates appointment record]
  ↓
[Patient sees updated status]
  ↓
END
```

### 4. Admin Journey

```
START
  ↓
[Admin Logs In]
  ↓
[Admin Dashboard]
  - System statistics
  - Total patients, doctors, appointments
  - Revenue tracking
  ↓
[Admin Actions]
  ├─ [Manage Users]
  │   - View all patients
  │   - Delete users
  │
  ├─ [Manage Doctors]
  │   - View all 23 doctors
  │   - Add new doctor
  │   - Delete doctor
  │
  └─ [Manage Appointments]
      - View all appointments
      - Filter by status
      - Monitor system
  ↓
END
```

### 5. Authentication Flow

```
START
  ↓
[User visits login page]
  ↓
[Selects user type: Patient/Doctor/Admin]
  ↓
[Enters username/email and password]
  ↓
[Clicks "Login"]
  ↓
[Frontend: Sends POST to /auth/login]
  ↓
[Backend: Validates credentials]
  ├─ [Invalid] → Returns 401 error
  │              ↓
  │         [Shows error message]
  │              ↓
  │         [User tries again]
  │
  └─ [Valid] → Generates JWT token
                ↓
           [Returns token + user_type]
                ↓
           [Frontend: Stores in localStorage]
                - token
                - userType
                - user object
                ↓
           [Redirects based on user type]
                ├─ Patient → /patient/dashboard
                ├─ Doctor → /doctor/dashboard
                └─ Admin → /admin/dashboard
                ↓
           [Protected routes check token]
                ↓
           [User accesses features]
                ↓
END
```

### 6. API Request Flow

```
[Frontend Component]
  ↓
[Calls API function from services/api.js]
  ↓
[Axios interceptor adds Authorization header]
  - Bearer <token from localStorage>
  ↓
[HTTP Request to Backend]
  ↓
[Backend: FastAPI receives request]
  ↓
[Backend: Validates JWT token]
  ├─ [Invalid/Expired] → Returns 401
  │                       ↓
  │                  [Frontend: Redirects to login]
  │
  └─ [Valid] → Processes request
                ↓
           [Queries database via SQLAlchemy]
                ↓
           [Returns JSON response]
                ↓
           [Frontend: Updates UI]
                ↓
END
```

### 7. ML Prediction Flow (Detailed)

```
[Patient selects symptoms]
  ↓
[Frontend: Sends POST to /predict]
  Body: { symptoms: ["chest_pain", "breathlessness", ...] }
  ↓
[Backend: Receives symptom list]
  ↓
[Creates feature vector (377 dimensions)]
  - All symptoms = 0
  - Selected symptoms = 1
  ↓
[Converts to pandas DataFrame]
  ↓
[Loads pre-trained model (model.pkl)]
  ↓
[Model predicts disease]
  - Uses Naive Bayes algorithm
  - Calculates probabilities
  ↓
[Gets prediction and confidence]
  - prediction = disease name
  - confidence = max probability
  ↓
[Maps disease to specialist]
  - Checks SPECIALIST_MAPPING dictionary
  - Falls back to keyword detection
  ↓
[Queries doctors by specialization]
  - Filters active doctors
  - Matches specialization
  ↓
[Looks up medications (if available)]
  - Checks MEDICATION_DATABASE
  ↓
[Creates medical history record]
  - Stores in database
  ↓
[Returns JSON response]
  {
    predicted_disease: "...",
    confidence: 0.875,
    recommended_specialist: "...",
    medications: [...]
  }
  ↓
[Frontend: Displays results]
  ↓
END
```

---

## 📊 System Statistics

### Current Database Content
- **Patients**: 1 (test user)
- **Doctors**: 23 (across 8 specialties)
- **Admins**: 1
- **Appointments**: 2 (test data)
- **Diseases**: 100 (in ML model)
- **Symptoms**: 377 (available for selection)

### Doctor Distribution
- Cardiologist: 3
- General Physician: 3
- Neurologist: 3
- Dermatologist: 3
- Orthopedist: 3
- Pediatrician: 3
- Gynecologist: 3
- Pulmonologist: 2

### Consultation Fees Range
- Minimum: ₹450
- Maximum: ₹1,500
- Average: ₹900

---

## 🔧 Technical Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite + SQLAlchemy ORM
- **ML**: scikit-learn (Naive Bayes)
- **Authentication**: JWT (python-jose)
- **Password**: bcrypt
- **Data**: pandas, numpy

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State**: React Context API

### Development
- **Backend Port**: 8000
- **Frontend Port**: 5173
- **CORS**: Enabled for localhost

---

This comprehensive documentation covers all aspects of the Eswatya AI Health Care System!
