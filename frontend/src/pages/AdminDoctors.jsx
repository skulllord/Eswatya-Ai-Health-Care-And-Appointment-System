import { useEffect, useState } from 'react'
import { getAllDoctorsAdmin, deleteDoctorAdmin } from '../services/api'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      console.log('Loading doctors from admin API...')
      const data = await getAllDoctorsAdmin()
      console.log('Doctors loaded:', data.length, 'doctors')
      setDoctors(data)
    } catch (error) {
      console.error('Error loading doctors:', error)
      console.error('Error details:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (doctorId, doctorName) => {
    if (window.confirm(`Are you sure you want to remove Dr. ${doctorName}?`)) {
      try {
        await deleteDoctorAdmin(doctorId)
        setDoctors(doctors.filter(d => d.id !== doctorId))
        alert('Doctor removed successfully')
      } catch (error) {
        alert('Error removing doctor: ' + error.message)
      }
    }
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👨‍⚕️ Manage Doctors</h1>
              <p className="text-teal-100">View, add, and manage all registered doctors</p>
            </div>
            <Link
              to="/admin/add-doctor"
              className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all transform hover:scale-105 shadow-lg"
            >
              ➕ Add New Doctor
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none text-lg"
          />
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
                  <div className="text-5xl mb-3">👨‍⚕️</div>
                  <h3 className="text-2xl font-bold">{doctor.full_name}</h3>
                  <p className="text-teal-100">{doctor.specialization}</p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-2">🎓</span>
                      <span className="text-sm">{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-2">⏰</span>
                      <span className="text-sm">{doctor.experience_years} years experience</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-2">📧</span>
                      <span className="text-sm">{doctor.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-2">📞</span>
                      <span className="text-sm">{doctor.phone}</span>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border-2 border-green-200">
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="text-2xl font-bold text-green-600">₹{doctor.consultation_fee.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Availability */}
                  {doctor.available_days && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Available Days:</p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.available_days.split(',').map((day, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {day.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(doctor.id, doctor.full_name)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    🗑️ Remove Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">No doctors found</p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white text-center">
          <p className="text-lg">Total Registered Doctors</p>
          <p className="text-5xl font-bold mt-2">{doctors.length}</p>
        </div>
      </main>
    </div>
  )
}

export default AdminDoctors
