import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createAppointment } from '../services/api'
import Navbar from '../components/Navbar'

function BookAppointmentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const doctor = location.state?.doctor

  const [appointmentDate, setAppointmentDate] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [loading, setLoading] = useState(false)

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">No doctor selected</p>
            <button
              onClick={() => navigate('/patient/find-doctors')}
              className="px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-dark"
            >
              Go to Find Doctors
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleBookAppointment = async (e) => {
    e.preventDefault()

    if (!appointmentDate) {
      alert('Please select appointment date and time')
      return
    }

    setLoading(true)
    try {
      await createAppointment({
        doctor_id: doctor.id,
        appointment_date: appointmentDate,
        symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
        predicted_disease: 'Direct Booking',
        confidence_score: 1.0
      })
      alert('Appointment booked successfully!')
      navigate('/patient/appointments')
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/patient/find-doctors')}
          className="mb-6 text-medical-primary hover:text-medical-dark flex items-center gap-2"
        >
          ← Back to Find Doctors
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Appointment</h1>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Doctor Information</h2>
          
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">👨‍⚕️</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{doctor.full_name}</h3>
              <p className="text-lg text-medical-primary">{doctor.specialization}</p>
              <p className="text-gray-600">{doctor.qualification}</p>
              <p className="text-gray-600">{doctor.experience_years} years experience</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Consultation Fee</p>
              <p className="text-3xl font-bold text-medical-primary">₹{doctor.consultation_fee}</p>
            </div>
          </div>

          {doctor.available_days && (
            <div className="bg-blue-50 border-l-4 border-medical-primary p-4 rounded">
              <p className="text-sm font-medium text-gray-700">Available Days:</p>
              <p className="text-gray-600">{doctor.available_days}</p>
              {doctor.available_time_start && doctor.available_time_end && (
                <p className="text-sm text-gray-600 mt-1">
                  Timing: {doctor.available_time_start} - {doctor.available_time_end}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBookAppointment} className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Appointment Details</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-medical-primary focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please select a date and time within the doctor's available hours
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms or Reason for Visit (Optional)
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., fever, headache, chest pain (separate with commas)"
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-medical-primary focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can list your symptoms separated by commas, or leave blank
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a direct booking without AI prediction. 
              If you want disease prediction and specialist recommendation, use the AI Prediction feature instead.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/patient/find-doctors')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-medical-primary text-white rounded-lg font-semibold hover:bg-medical-dark transition-colors disabled:bg-gray-300"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>

        {/* Alternative Option */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Want AI-powered disease prediction?</p>
          <button
            onClick={() => navigate('/patient/predict')}
            className="text-medical-primary hover:text-medical-dark font-semibold"
          >
            Use AI Prediction →
          </button>
        </div>
      </main>
    </div>
  )
}

export default BookAppointmentPage
