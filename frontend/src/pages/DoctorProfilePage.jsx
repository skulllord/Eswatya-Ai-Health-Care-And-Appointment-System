import { useEffect, useState } from 'react'
import { getDoctorProfile, updateDoctorProfile } from '../services/api'
import Navbar from '../components/Navbar'

function DoctorProfilePage() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [photoPreview, setPhotoPreview] = useState(null)

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      console.log('Loading doctor profile...')
      const data = await getDoctorProfile()
      console.log('Profile data received:', data)
      setProfile(data)
      setFormData({
        ...data,
        available_days: data.available_days ? data.available_days.split(',') : []
      })
      if (data.profile_photo) {
        setPhotoPreview(data.profile_photo)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      console.error('Error details:', error.response?.data || error.message)
      alert('Failed to load profile: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
        setFormData({...formData, profile_photo: reader.result})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDayToggle = (day) => {
    const days = formData.available_days || []
    setFormData({
      ...formData,
      available_days: days.includes(day)
        ? days.filter(d => d !== day)
        : [...days, day]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        ...formData,
        available_days: formData.available_days.join(',')
      }
      const updated = await updateDoctorProfile(updateData)
      setProfile(updated)
      setEditing(false)
      alert('Profile updated successfully!')
      loadProfile()
    } catch (error) {
      alert('Failed to update profile: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-medical-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Profile</h2>
            <p className="text-gray-600 mb-4">Unable to retrieve your profile information.</p>
            <button
              onClick={loadProfile}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">👨‍⚕️ Doctor Profile</h1>
          <p className="text-teal-100">Manage your professional information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {!editing ? (
            <>
              {/* Profile Header with Photo */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-white">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                        <span className="text-6xl text-teal-500">👨‍⚕️</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{profile.full_name}</h2>
                    <p className="text-teal-100 text-lg">{profile.specialization}</p>
                    <p className="text-teal-200 text-sm">{profile.qualification}</p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-blue-600 font-semibold mb-1">📧 Email</p>
                    <p className="font-semibold text-gray-800 text-lg">{profile.email}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                    <p className="text-sm text-green-600 font-semibold mb-1">📞 Phone</p>
                    <p className="font-semibold text-gray-800 text-lg">{profile.phone}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                    <p className="text-sm text-purple-600 font-semibold mb-1">⏰ Experience</p>
                    <p className="font-semibold text-gray-800 text-lg">{profile.experience_years} years</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
                    <p className="text-sm text-orange-600 font-semibold mb-1">💰 Consultation Fee</p>
                    <p className="font-semibold text-gray-800 text-lg">₹{profile.consultation_fee?.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mt-6 bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border-2 border-indigo-200">
                    <p className="text-sm text-indigo-600 font-semibold mb-2">📝 Bio</p>
                    <p className="text-gray-800">{profile.bio}</p>
                  </div>
                )}

                {/* Availability */}
                <div className="mt-6 bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-200">
                  <p className="text-sm text-pink-600 font-semibold mb-3">📅 Available Days</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.available_days?.split(',').map((day, idx) => (
                      <span key={idx} className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {day.trim()}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    🕐 {profile.available_time_start} - {profile.available_time_end}
                  </p>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-8 w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="p-8">
              {/* Photo Upload Section */}
              <div className="mb-8 text-center">
                <div className="flex flex-col items-center">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Profile Preview" 
                      className="w-40 h-40 rounded-full border-4 border-teal-500 shadow-lg object-cover mb-4"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-lg bg-gray-100 flex items-center justify-center mb-4">
                      <span className="text-7xl text-gray-400">👨‍⚕️</span>
                    </div>
                  )}
                  <label className="cursor-pointer bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg">
                    📷 Upload Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience_years || ''}
                    onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.consultation_fee || ''}
                    onChange={(e) => setFormData({...formData, consultation_fee: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available From
                  </label>
                  <input
                    type="time"
                    value={formData.available_time_start || ''}
                    onChange={(e) => setFormData({...formData, available_time_start: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Until
                  </label>
                  <input
                    type="time"
                    value={formData.available_time_end || ''}
                    onChange={(e) => setFormData({...formData, available_time_end: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  rows="3"
                  placeholder="Brief description about yourself..."
                />
              </div>

              {/* Available Days */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-3">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                        formData.available_days?.includes(day)
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      ...profile,
                      available_days: profile.available_days ? profile.available_days.split(',') : []
                    })
                    setPhotoPreview(profile.profile_photo)
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default DoctorProfilePage
