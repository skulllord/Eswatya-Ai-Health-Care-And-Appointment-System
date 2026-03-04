import { useEffect, useState } from 'react'
import { getSystemStats, getAllAppointmentsAdmin, getAllDoctorsAdmin } from '../services/api'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('Loading admin dashboard data...')
      const [statsData, appointmentsData, doctorsData] = await Promise.all([
        getSystemStats(),
        getAllAppointmentsAdmin(),
        getAllDoctorsAdmin()
      ])
      console.log('Stats:', statsData)
      console.log('Appointments:', appointmentsData.length)
      console.log('Doctors:', doctorsData.length)
      setStats(statsData)
      setAppointments(appointmentsData.slice(0, 5))
      setDoctors(doctorsData)
    } catch (error) {
      console.error('Error loading data:', error)
      console.error('Error details:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <div className="text-9xl">🏥</div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">Welcome to Eswatya AI Health Care System Control Panel</p>
          </div>
        </div>

        {/* Statistics Cards with Gradients */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-6 text-white">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-blue-100 text-sm font-semibold">Total Patients</p>
            <p className="text-4xl font-bold mt-2">{stats?.total_patients || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-6 text-white">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <p className="text-green-100 text-sm font-semibold">Total Doctors</p>
            <p className="text-4xl font-bold mt-2">{stats?.total_doctors || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-6 text-white">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-purple-100 text-sm font-semibold">Total Appointments</p>
            <p className="text-4xl font-bold mt-2">{stats?.total_appointments || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-6 text-white">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-yellow-100 text-sm font-semibold">Total Revenue</p>
            <p className="text-4xl font-bold mt-2">₹{stats?.total_revenue?.toLocaleString('en-IN') || 0}</p>
          </div>
        </div>

        {/* Quick Actions with Enhanced Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/users" className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-blue-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">All Users</h3>
            <p className="text-gray-600 mb-3">View all patients</p>
            <div className="flex items-center justify-between">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                Total: {stats?.total_patients || 0}
              </span>
              <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          <Link to="/admin/appointments" className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-purple-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">All Appointments</h3>
            <p className="text-gray-600 mb-3">View and manage</p>
            <div className="flex items-center justify-between">
              <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                Pending: {stats?.pending_appointments || 0}
              </span>
              <span className="text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          <Link to="/admin/doctors" className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-green-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍⚕️</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Manage Doctors</h3>
            <p className="text-gray-600 mb-3">Add, edit, or remove</p>
            <div className="flex items-center justify-between">
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                Total: {doctors.length}
              </span>
              <span className="text-green-600 font-semibold group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          <Link to="/admin/add-doctor" className="group bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:from-indigo-600 hover:to-purple-700 p-8">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">➕</div>
            <h3 className="text-2xl font-bold mb-2">Add New Doctor</h3>
            <p className="text-indigo-100 mb-3">Register a new doctor</p>
            <span className="text-white font-semibold group-hover:translate-x-2 transition-transform inline-block">Get Started →</span>
          </Link>
        </div>

        {/* Recent Appointments with Better Design */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📊 Recent Appointments</h2>
            <Link to="/admin/appointments" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
              View All →
            </Link>
          </div>
          
          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold rounded-tl-lg">Patient</th>
                    <th className="px-6 py-4 text-left font-semibold">Doctor</th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold rounded-tr-lg">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, index) => (
                    <tr key={apt.id} className={`border-b hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-6 py-4 font-semibold text-gray-800">{apt.patient_name}</td>
                      <td className="px-6 py-4 text-gray-700">{apt.doctor_name}</td>
                      <td className="px-6 py-4 text-gray-700">{new Date(apt.appointment_date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          apt.status === 'approved' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          apt.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {apt.payment_status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-500">No appointments yet</p>
            </div>
          )}
        </div>

        {/* Doctors List with Cards */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">👨‍⚕️ All Registered Doctors ({doctors.length})</h2>
            <Link to="/admin/doctors" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
              Manage All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-400 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="text-4xl mb-3">👨‍⚕️</div>
                <h3 className="font-bold text-lg text-gray-800">{doctor.full_name}</h3>
                <p className="text-sm text-indigo-600 font-semibold">{doctor.specialization}</p>
                <p className="text-sm text-gray-500 mt-1">{doctor.qualification}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-green-600 font-bold text-xl">₹{doctor.consultation_fee.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500">Consultation Fee</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
