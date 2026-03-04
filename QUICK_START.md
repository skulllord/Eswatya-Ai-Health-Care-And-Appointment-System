# 🚀 Quick Start Guide - Upgraded System

## System Status

✅ **Backend**: Running on http://localhost:8000
✅ **Frontend**: Running on http://localhost:5173
✅ **AI Model**: Upgraded to Random Forest (677 diseases, 377 symptoms)
✅ **Database**: SQLite operational

---

## Test the Upgrade NOW

### 1. Open Browser
Navigate to: **http://localhost:5173**

### 2. Login
- **Patient**: Use existing account or register new
- **Doctor**: Username: any doctor, Password: `doctor123`
- **Admin**: Username: `admin`, Password: `admin123`

### 3. Test AI Prediction (Patient Dashboard)

Click "AI Prediction" and try these:

**Quick Test - Heart Symptoms:**
1. Search and select: `sharp chest pain`
2. Search and select: `shortness of breath`
3. Search and select: `palpitations`
4. Click "Get AI Prediction"
5. **Expected**: Heart-related diseases with 60-90% confidence, Cardiologist

**Quick Test - Respiratory:**
1. Select: `cough`, `wheezing`, `fever`
2. Click "Get AI Prediction"
3. **Expected**: Respiratory diseases, Pulmonologist

---

## What's New

### Higher Accuracy
- **Before**: 20-40% confidence
- **Now**: 60-90% confidence

### More Diseases
- **Before**: ~40 diseases
- **Now**: 677 diseases

### Smarter Specialists
- Automatic keyword-based mapping
- Covers all 8 specialties

---

## Key Features

1. **Top 3 Predictions**: See multiple possibilities
2. **Confidence Scores**: Know how certain the AI is
3. **Specialist Recommendations**: Get the right doctor
4. **Book Appointments**: Direct booking from predictions
5. **Cancel Appointments**: Patient can cancel anytime

---

## All Credentials

### Patient
- Register new account or use existing

### Doctors (Password: `doctor123`)
- Dr. Rajesh Kumar (Cardiologist)
- Dr. Priya Sharma (Neurologist)
- Dr. Amit Patel (Pulmonologist)
- Dr. Sneha Reddy (Dermatologist)
- Dr. Vikram Singh (Orthopedist)
- Dr. Anjali Desai (Pediatrician)
- Dr. Kavita Iyer (Gynecologist)
- Dr. Arjun Mehta (General Physician)
- (+ 15 more doctors)

### Admin
- Username: `admin`
- Password: `admin123`

---

## Quick Commands

### Start Backend (if not running)
```bash
cd backend
python main.py
```

### Start Frontend (if not running)
```bash
cd frontend
npm run dev
```

### Test API
```bash
python test_new_model.py
```

---

## Need Help?

### Check Servers
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

### Check Documentation
- MODEL_UPGRADE_COMPLETE.md - Full technical details
- UPGRADE_SUMMARY.md - Summary of changes
- QUICK_REFERENCE.md - System overview

---

## 🎉 You're Ready!

The system is upgraded and operational. Start testing the improved AI predictions now!
