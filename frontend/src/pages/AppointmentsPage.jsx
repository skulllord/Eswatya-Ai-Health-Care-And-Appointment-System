import { useEffect, useState } from 'react'
import { getPatientAppointments, cancelAppointment } from '../services/api'
import Navbar from '../components/Navbar'

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await getPatientAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    setCancelling(appointmentId)
    try {
      await cancelAppointment(appointmentId)
      alert('Appointment cancelled successfully')
      loadAppointments() // Reload appointments
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      alert(error.response?.data?.detail || 'Failed to cancel appointment')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canCancelAppointment = (apt) => {
    return apt.status !== 'completed' && apt.status !== 'cancelled'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Appointments</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-medical-primary"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="grid gap-6">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{apt.doctor_name}</h3>
                    <p className="text-gray-600">{apt.doctor_specialization}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Date & Time:</p>
                    <p className="font-semibold">{new Date(apt.appointment_date).toLocaleString('en-IN')}</p>
                  </div>
                  
                  {apt.predicted_disease && (
                    <div>
                      <p className="text-gray-600">Predicted Disease:</p>
                      <p className="font-semibold">{apt.predicted_disease}</p>
                    </div>
                  )}

                  {apt.confidence_score && (
                    <div>
                      <p className="text-gray-600">Confidence Score:</p>
                      <p className="font-semibold">{(apt.confidence_score * 100).toFixed(1)}%</p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-600">Payment Status:</p>
                    <p className="font-semibold capitalize">{apt.payment_status || 'unpaid'}</p>
                  </div>
                  
                  {apt.consultation_notes && (
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Doctor's Notes:</p>
                      <p className="font-semibold">{apt.consultation_notes}</p>
                    </div>
                  )}
                </div>

                {canCancelAppointment(apt) && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      disabled={cancelling === apt.id}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {cancelling === apt.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <span>❌</span>
                          Cancel Appointment
                        </>
                      )}
                    </button>
                  </div>
                )}

                {apt.status === 'cancelled' && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-red-700 text-sm">
                      <strong>Cancelled:</strong> This appointment has been cancelled
                    </p>
                  </div>
                )}

                {apt.status === 'completed' && (
                  <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-blue-700 text-sm">
                      <strong>Completed:</strong> This consultation has been completed
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl text-gray-500 mb-2">No appointments yet</p>
            <p className="text-gray-400">Book your first appointment to get started</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AppointmentsPage
