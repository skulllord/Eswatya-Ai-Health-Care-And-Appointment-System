import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorProfilePage from './pages/DoctorProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminDashboardSimple from './pages/AdminDashboardSimple'
import AdminDebugPage from './pages/AdminDebugPage'
import AdminAppointments from './pages/AdminAppointments'
import AdminDoctors from './pages/AdminDoctors'
import AdminUsers from './pages/AdminUsers'
import AddDoctor from './pages/AddDoctor'
import PredictionPage from './pages/PredictionPage'
import AppointmentsPage from './pages/AppointmentsPage'
import ProfilePage from './pages/ProfilePage'
import FindDoctorsPage from './pages/FindDoctorsPage'
import BookAppointmentPage from './pages/BookAppointmentPage'

function ProtectedRoute({ children, allowedRole }) {
  const { user, userType, loading } = useAuth()
  
  console.log('ProtectedRoute check:', { user, userType, allowedRole, loading })
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    )
  }
  
  if (!user || !userType) {
    console.log('No user or userType, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  if (allowedRole && userType !== allowedRole) {
    console.log(`UserType mismatch: ${userType} !== ${allowedRole}, redirecting to /`)
    return <Navigate to="/" replace />
  }
  
  return children
}

function AppRoutes() {
  const { userType } = useAuth()
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/predict"
        element={
          <ProtectedRoute allowedRole="patient">
            <PredictionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRole="patient">
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allowedRole="patient">
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/find-doctors"
        element={
          <ProtectedRoute allowedRole="patient">
            <FindDoctorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute allowedRole="patient">
            <BookAppointmentPage />
          </ProtectedRoute>
        }
      />
      
      {/* Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorProfilePage />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route path="/admin/debug" element={<AdminDebugPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboardSimple />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-doctor"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddDoctor />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
