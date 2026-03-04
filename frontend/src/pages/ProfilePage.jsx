import { useEffect, useState } from 'react'
import { getPatientProfile, updatePatientProfile } from '../services/api'
import Navbar from '../components/Navbar'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [photoPreview, setPhotoPreview] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getPatientProfile()
      setProfile(data)
      setFormData(data)
      if (data.profile_photo) {
        setPhotoPreview(data.profile_photo)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Convert to base64 for preview and storage
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
        setFormData({...formData, profile_photo: reader.result})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updated = await updatePatientProfile(formData)
      setProfile(updated)
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-medical-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">👤 My Profile</h1>
          <p className="text-green-100">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {!editing ? (
            <>
              {/* Profile Header with Photo */}
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-8 text-white">
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
                        <span className="text-6xl text-green-500">👤</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{profile.full_name}</h2>
                    <p className="text-green-100 text-lg">@{profile.username}</p>
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
                    <p className="font-semibold text-gray-800 text-lg">{profile.phone || 'Not provided'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                    <p className="text-sm text-purple-600 font-semibold mb-1">🎂 Age</p>
                    <p className="font-semibold text-gray-800 text-lg">{profile.age || 'Not provided'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-200">
                    <p className="text-sm text-pink-600 font-semibold mb-1">⚧ Gender</p>
                    <p className="font-semibold text-gray-800 text-lg">{profile.gender || 'Not provided'}</p>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
                  <p className="text-sm text-orange-600 font-semibold mb-1">🏠 Address</p>
                  <p className="font-semibold text-gray-800 text-lg">{profile.address || 'Not provided'}</p>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-8 w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
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
                      className="w-40 h-40 rounded-full border-4 border-green-500 shadow-lg object-cover mb-4"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-lg bg-gray-100 flex items-center justify-center mb-4">
                      <span className="text-7xl text-gray-400">👤</span>
                    </div>
                  )}
                  <label className="cursor-pointer bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg">
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    placeholder="Address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setFormData(profile)
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

export default ProfilePage
