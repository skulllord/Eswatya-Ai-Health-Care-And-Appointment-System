import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMedicalHistory, getPatientAppointments } from '../services/api'
import Navbar from '../components/Navbar'

function PatientDashboard() {
  const { user, logout } = useAuth()
  const [history, setHistory] = useState([])
  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [historyData, appointmentsData] = await Promise.all([
        getMedicalHistory(),
        getPatientAppointments()
      ])
      setHistory(historyData.slice(0, 3))
      setAppointments(appointmentsData.slice(0, 3))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome, {user?.username}!
        </h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link to="/patient/find-doctors" className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-white">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Find Doctors</h3>
            <p className="text-blue-100">Browse and book appointments directly</p>
          </Link>

          <Link to="/patient/predict" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-xl font-semibold mb-2">AI Prediction</h3>
            <p className="text-gray-600">Get disease prediction based on symptoms</p>
          </Link>

          <Link to="/patient/appointments" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Appointments</h3>
            <p className="text-gray-600">View and manage your appointments</p>
          </Link>

          <Link to="/patient/profile" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-gray-600">Update your personal information</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Predictions</h2>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="border-l-4 border-medical-primary pl-4">
                    <p className="font-semibold">{item.predicted_disease}</p>
                    <p className="text-sm text-gray-600">
                      Confidence: {(item.confidence_score * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No predictions yet</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold">{apt.doctor_name}</p>
                    <p className="text-sm text-gray-600">{apt.doctor_specialization}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(apt.appointment_date).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      apt.status === 'approved' ? 'bg-green-100 text-green-800' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No appointments yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientDashboard
