# 🏥 Eswatya AI Health Care & Appointment System

An intelligent healthcare platform powered by AI for disease prediction, doctor appointments, and medical management.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-83.63%25-orange.svg)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### 🤖 AI Disease Prediction
- **83.63% accuracy** using XGBoost algorithm
- Predicts from **677 diseases** based on **377 symptoms**
- Returns **top 3 predictions** with confidence scores
- Automatic specialist recommendations

### 👨‍⚕️ Doctor Management
- 23 doctors across 8 medical specialties
- Doctor profiles with qualifications and experience
- Availability management and time slots
- Consultation fee tracking in Indian Rupees (₹)

### 📅 Appointment System
- Direct booking without AI prediction
- Book appointments from AI predictions
- Time slot management (30-minute intervals)
- Appointment cancellation for patients
- Status tracking (pending, confirmed, completed, cancelled)

### 👤 User Roles
- **Patients**: Register, predict diseases, book appointments, view history
- **Doctors**: Manage appointments, update profiles, add consultation notes
- **Admins**: System management, user management, statistics dashboard

### 📊 Analytics & Reporting
- Confusion matrix analysis
- Per-disease accuracy metrics
- System statistics and revenue tracking
- Medical history tracking

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/skulllord/Eswatya-Ai-Health-Care-And-Appointment-System.git
cd Eswatya-Ai-Health-Care-And-Appointment-System
```

2. **Setup Backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python init_db.py  # Initialize database
python main.py     # Start backend server
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🔐 Default Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Doctors
- Username: Any doctor username (e.g., `rajesh.kumar`)
- Password: `doctor123`

### Patients
- Register a new account through the application

## 📁 Project Structure

```
Eswatya-AI-Health-Care/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # Authentication
│   ├── database.py             # Database configuration
│   ├── model.pkl               # XGBoost model (83.63% accuracy)
│   ├── label_encoder.pkl       # Disease label encoder
│   ├── feature_columns.pkl     # Symptom features
│   ├── eswatya_healthcare.db   # SQLite database
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # React pages
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context (Auth)
│   │   └── services/          # API services
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
└── docs/
    ├── XGBOOST_UPGRADE_COMPLETE.md
    ├── CONFUSION_MATRIX_ANALYSIS.md
    └── ACCURACY_IMPROVEMENT_GUIDE.md
```

## 🧠 AI Model Details

### Current Model: XGBoost
- **Algorithm**: Extreme Gradient Boosting
- **Test Accuracy**: 83.63%
- **Training Samples**: 197,209
- **Test Samples**: 49,303
- **Diseases**: 677
- **Symptoms**: 377
- **Perfect Predictions**: 321 diseases (100% accuracy)

### Model Performance
- **Average Per-Class Accuracy**: 81.80%
- **Median Per-Class Accuracy**: 88.97%
- **Diseases with >90% accuracy**: 321
- **Diseases with >80% accuracy**: 456

### Comparison
| Model | Accuracy | Improvement |
|-------|----------|-------------|
| Previous (Random Forest) | 67.36% | Baseline |
| Optimized Random Forest | 77.82% | +10.46% |
| **XGBoost (Current)** | **83.63%** | **+16.27%** |

## 🏥 Medical Specialties

1. **Cardiologist** - Heart and cardiovascular diseases
2. **Neurologist** - Brain and nervous system disorders
3. **Pulmonologist** - Lung and respiratory conditions
4. **Dermatologist** - Skin, hair, and nail disorders
5. **Orthopedist** - Bone, joint, and muscle problems
6. **Pediatrician** - Children's health
7. **Gynecologist** - Women's reproductive health
8. **General Physician** - General medical conditions

## 🔧 Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **ML Library**: XGBoost, scikit-learn
- **Data Processing**: pandas, numpy

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

### AI/ML
- **Algorithm**: XGBoost (Extreme Gradient Boosting)
- **Training**: scikit-learn pipeline
- **Visualization**: matplotlib, seaborn

## 📊 API Endpoints

### Authentication
- `POST /auth/register/patient` - Register patient
- `POST /auth/register/doctor` - Register doctor
- `POST /auth/login` - Login (all roles)

### Predictions
- `GET /symptoms` - Get all symptoms
- `POST /predict` - Predict disease from symptoms

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments` - Get user appointments
- `PUT /appointments/{id}/cancel` - Cancel appointment

### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors?specialization={spec}` - Filter by specialty

### Admin
- `GET /admin/stats` - System statistics
- `GET /admin/appointments` - All appointments
- `GET /admin/doctors` - Manage doctors
- `GET /admin/users` - Manage users

Full API documentation available at: http://localhost:8000/docs

## 🧪 Testing

### Test AI Predictions
```bash
cd backend
python test_new_model.py
```

### Generate Confusion Matrix
```bash
cd backend
python generate_confusion_matrix.py
```

### Test Cases

**Heart Symptoms**:
- Symptoms: sharp chest pain, shortness of breath, palpitations
- Expected: 90%+ confidence for heart disease
- Specialist: Cardiologist

**Respiratory Symptoms**:
- Symptoms: cough, wheezing, fever
- Expected: 40-60% confidence for respiratory disease
- Specialist: Pulmonologist

## 📈 Performance Metrics

### System Performance
- **API Response Time**: <100ms
- **Model Inference Time**: <100ms
- **Database Queries**: Optimized with indexes
- **Concurrent Users**: Supports multiple simultaneous users

### Model Metrics
- **Precision**: 83.63%
- **Recall**: 83.63%
- **F1-Score**: 83.63%
- **Confusion Matrix**: Available in docs/

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- SQL injection prevention (SQLAlchemy ORM)
- CORS configuration
- Input validation with Pydantic

## 🚧 Future Improvements

### Short Term
- [ ] Add symptom severity levels
- [ ] Implement ensemble methods
- [ ] Collect user feedback system
- [ ] Add email notifications

### Medium Term
- [ ] Deep learning model integration
- [ ] Patient demographics integration
- [ ] Lab test results support
- [ ] Telemedicine features

### Long Term
- [ ] Mobile application
- [ ] Electronic health records integration
- [ ] Multi-language support
- [ ] Real-time chat with doctors

## 📝 Documentation

- [XGBoost Upgrade Details](XGBOOST_UPGRADE_COMPLETE.md)
- [Confusion Matrix Analysis](CONFUSION_MATRIX_ANALYSIS.md)
- [Accuracy Improvement Guide](ACCURACY_IMPROVEMENT_GUIDE.md)
- [Project Details](PROJECT_DETAILS.md)
- [Quick Start Guide](QUICK_START.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [skulllord](https://github.com/skulllord)

## 🙏 Acknowledgments

- XGBoost team for the excellent ML library
- FastAPI for the modern Python web framework
- React team for the frontend framework
- Medical dataset contributors

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ for better healthcare**

**Status**: ✅ Production Ready | **Accuracy**: 83.63% | **Diseases**: 677 | **Symptoms**: 377
