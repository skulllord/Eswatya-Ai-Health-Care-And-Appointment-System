import { useEffect, useState } from 'react'
import { getAllUsersAdmin, deleteUserAdmin } from '../services/api'
import Navbar from '../components/Navbar'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await getAllUsersAdmin()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to remove user ${userName}? This will also delete all their appointments and medical history.`)) {
      try {
        await deleteUserAdmin(userId)
        setUsers(users.filter(u => u.id !== userId))
        alert('User removed successfully')
      } catch (error) {
        alert('Error removing user: ' + error.message)
      }
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👥 Manage Users (Patients)</h1>
              <p className="text-blue-100">View and manage all registered patients</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center space-x-4">
                    {user.profile_photo ? (
                      <img 
                        src={user.profile_photo} 
                        alt={user.full_name}
                        className="w-16 h-16 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{user.full_name}</h3>
                      <p className="text-blue-100 text-sm">@{user.username}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-2">📧</span>
                      <span className="text-sm break-all">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-gray-700">
                        <span className="text-xl mr-2">📞</span>
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    {user.age && (
                      <div className="flex items-center text-gray-700">
                        <span className="text-xl mr-2">🎂</span>
                        <span className="text-sm">{user.age} years old</span>
                      </div>
                    )}
                    {user.gender && (
                      <div className="flex items-center text-gray-700">
                        <span className="text-xl mr-2">⚧</span>
                        <span className="text-sm">{user.gender}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-start text-gray-700">
                        <span className="text-xl mr-2">🏠</span>
                        <span className="text-sm">{user.address}</span>
                      </div>
                    )}
                  </div>

                  {/* User ID Badge */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4 border-2 border-blue-200">
                    <p className="text-xs text-gray-600">User ID</p>
                    <p className="text-lg font-bold text-blue-600">#{user.id}</p>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(user.id, user.full_name)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    🗑️ Remove User
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">No users found</p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white text-center">
          <p className="text-lg">Total Registered Users (Patients)</p>
          <p className="text-5xl font-bold mt-2">{users.length}</p>
        </div>
      </main>
    </div>
  )
}

export default AdminUsers
