import { useEffect, useState } from 'react'
import { getAllAppointmentsAdmin } from '../services/api'
import Navbar from '../components/Navbar'

function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointmentsAdmin()
      setAppointments(data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    return apt.status === filter
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPaymentColor = (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-orange-100 text-orange-800 border-orange-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-medical-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">📋 All Appointments</h1>
          <p className="text-purple-100">Manage and monitor all patient appointments</p>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'approved', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  filter === status
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                  {status === 'all' ? appointments.length : appointments.filter(a => a.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Patient</th>
                    <th className="px-6 py-4 text-left font-semibold">Doctor</th>
                    <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left font-semibold">Reason</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt, index) => (
                    <tr 
                      key={apt.id} 
                      className={`border-b hover:bg-purple-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">#{apt.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{apt.patient_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{apt.doctor_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-800">{new Date(apt.appointment_date).toLocaleDateString('en-IN')}</div>
                        <div className="text-sm text-gray-500">{apt.appointment_time}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{apt.reason || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(apt.status)}`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentColor(apt.payment_status)}`}>
                          {apt.payment_status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600">No appointments found for this filter</p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-100 text-sm">Completed</p>
            <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'completed').length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-yellow-100 text-sm">Pending</p>
            <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">👍</div>
            <p className="text-blue-100 text-sm">Approved</p>
            <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'approved').length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">❌</div>
            <p className="text-red-100 text-sm">Cancelled</p>
            <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'cancelled').length}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminAppointments
