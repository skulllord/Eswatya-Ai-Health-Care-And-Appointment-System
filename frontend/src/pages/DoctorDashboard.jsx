import { useEffect, useState } from 'react'
import { getDoctorAppointments, updateAppointment } from '../services/api'
import Navbar from '../components/Navbar'

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({})

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await getDoctorAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await updateAppointment(appointmentId, {
        status,
        consultation_notes: notes[appointmentId] || ''
      })
      loadAppointments()
      alert('Appointment updated successfully!')
    } catch (error) {
      alert('Failed to update appointment')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : appointments.length > 0 ? (
          <div className="grid gap-6">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{apt.patient_name}</h3>
                    <p className="text-gray-600">
                      {new Date(apt.appointment_date).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>

                {apt.predicted_disease && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Predicted Disease:</p>
                    <p className="font-semibold">{apt.predicted_disease}</p>
                    <p className="text-sm text-gray-600">
                      Confidence: {(apt.confidence_score * 100).toFixed(2)}%
                    </p>
                  </div>
                )}

                {apt.symptoms && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Symptoms:</p>
                    <p className="text-sm">{JSON.parse(apt.symptoms).join(', ')}</p>
                  </div>
                )}

                {apt.status === 'pending' && (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add consultation notes..."
                      value={notes[apt.id] || ''}
                      onChange={(e) => setNotes({...notes, [apt.id]: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-medical-primary focus:outline-none"
                      rows="3"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'approved')}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'rejected')}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {apt.status === 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'completed')}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}

                {apt.consultation_notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Consultation Notes:</p>
                    <p className="text-sm">{apt.consultation_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500">No appointments yet</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard
