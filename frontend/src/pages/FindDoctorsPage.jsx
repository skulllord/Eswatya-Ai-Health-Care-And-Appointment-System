import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDoctors } from '../services/api'
import Navbar from '../components/Navbar'

function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Specialty icons mapping
  const specialtyIcons = {
    'General Physician': '🩺',
    'Cardiologist': '❤️',
    'Neurologist': '🧠',
    'Dermatologist': '✨',
    'Pulmonologist': '🫁',
    'Pediatrician': '👶',
    'Orthopedist': '🦴',
    'Gynecologist': '👩‍⚕️',
    'Psychiatrist': '🧘',
    'Dentist': '🦷',
    'Ophthalmologist': '👁️',
    'ENT Specialist': '👂'
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [selectedSpecialty, searchTerm, doctors])

  const loadDoctors = async () => {
    try {
      const data = await getDoctors()
      setDoctors(data)
      setFilteredDoctors(data)
    } catch (error) {
      console.error('Error loading doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    let filtered = doctors

    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(doc => doc.specialization === selectedSpecialty)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDoctors(filtered)
  }

  // Get unique specialties
  const specialties = ['All', ...new Set(doctors.map(doc => doc.specialization))]

  // Group doctors by specialty
  const doctorsBySpecialty = filteredDoctors.reduce((acc, doctor) => {
    const specialty = doctor.specialization
    if (!acc[specialty]) {
      acc[specialty] = []
    }
    acc[specialty].push(doctor)
    return acc
  }, {})

  const handleBookAppointment = (doctor) => {
    // Navigate to appointments page with doctor info
    navigate('/patient/book-appointment', { state: { doctor } })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading doctors...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find a Doctor</h1>
          <p className="text-gray-600">Browse our expert doctors by specialty</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Doctors
              </label>
              <input
                type="text"
                placeholder="Search by name, specialty, or qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-medical-primary focus:outline-none"
              />
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-medical-primary focus:outline-none"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Specialty Categories (Quick Filter) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse by Specialty</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {specialties.filter(s => s !== 'All').map(specialty => {
              const count = doctors.filter(d => d.specialization === specialty).length
              return (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSpecialty === specialty
                      ? 'border-medical-primary bg-medical-light'
                      : 'border-gray-200 hover:border-medical-primary'
                  }`}
                >
                  <div className="text-3xl mb-2">{specialtyIcons[specialty] || '👨‍⚕️'}</div>
                  <div className="text-sm font-medium text-gray-800">{specialty}</div>
                  <div className="text-xs text-gray-500">{count} doctor{count !== 1 ? 's' : ''}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Doctors List - Grouped by Specialty */}
        {selectedSpecialty === 'All' ? (
          // Show all doctors grouped by specialty
          Object.keys(doctorsBySpecialty).sort().map(specialty => (
            <div key={specialty} className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{specialtyIcons[specialty] || '👨‍⚕️'}</span>
                <h2 className="text-2xl font-bold text-gray-800">{specialty}</h2>
                <span className="ml-3 text-sm text-gray-500">
                  ({doctorsBySpecialty[specialty].length} doctor{doctorsBySpecialty[specialty].length !== 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctorsBySpecialty[specialty].map(doctor => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    onBook={handleBookAppointment}
                    icon={specialtyIcons[specialty]}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show filtered doctors
          <div>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{specialtyIcons[selectedSpecialty] || '👨‍⚕️'}</span>
              <h2 className="text-2xl font-bold text-gray-800">{selectedSpecialty}</h2>
            </div>
            
            {filteredDoctors.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    onBook={handleBookAppointment}
                    icon={specialtyIcons[selectedSpecialty]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No doctors found matching your criteria</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// Doctor Card Component
function DoctorCard({ doctor, onBook, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Doctor Header */}
      <div className="bg-gradient-to-r from-medical-primary to-medical-secondary p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-4xl">{icon || '👨‍⚕️'}</div>
          <div className="bg-white text-medical-primary px-3 py-1 rounded-full text-sm font-semibold">
            ₹{doctor.consultation_fee}
          </div>
        </div>
        <h3 className="text-xl font-bold">{doctor.full_name}</h3>
        <p className="text-sm opacity-90">{doctor.specialization}</p>
      </div>

      {/* Doctor Details */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <span className="text-gray-500 text-sm mr-2">🎓</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Qualification</p>
              <p className="text-sm text-gray-600">{doctor.qualification || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 text-sm mr-2">💼</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Experience</p>
              <p className="text-sm text-gray-600">{doctor.experience_years} years</p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 text-sm mr-2">📞</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Contact</p>
              <p className="text-sm text-gray-600">{doctor.phone || 'Not available'}</p>
            </div>
          </div>

          {doctor.available_days && (
            <div className="flex items-start">
              <span className="text-gray-500 text-sm mr-2">📅</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Available</p>
                <p className="text-sm text-gray-600">
                  {doctor.available_days.split(',').slice(0, 3).join(', ')}
                  {doctor.available_days.split(',').length > 3 && '...'}
                </p>
              </div>
            </div>
          )}

          {doctor.available_time_start && doctor.available_time_end && (
            <div className="flex items-start">
              <span className="text-gray-500 text-sm mr-2">🕐</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Timing</p>
                <p className="text-sm text-gray-600">
                  {doctor.available_time_start} - {doctor.available_time_end}
                </p>
              </div>
            </div>
          )}
        </div>

        {doctor.bio && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 line-clamp-3">{doctor.bio}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onBook(doctor)}
            className="flex-1 bg-medical-primary text-white py-3 rounded-lg font-semibold hover:bg-medical-dark transition-colors"
          >
            Book Appointment
          </button>
          <button
            className="px-4 py-3 border-2 border-medical-primary text-medical-primary rounded-lg hover:bg-medical-light transition-colors"
            title="View Profile"
          >
            👁️
          </button>
        </div>
      </div>
    </div>
  )
}

export default FindDoctorsPage
