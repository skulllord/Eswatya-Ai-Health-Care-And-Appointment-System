import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AdminDashboardSimple() {
  const { user, userType, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AdminDashboard mounted')
    console.log('User:', user)
    console.log('UserType:', userType)
    console.log('Token:', localStorage.getItem('token'))
    
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Loading admin data with token:', token?.substring(0, 20) + '...')
      
      const response = await fetch('http://localhost:8000/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Stats data:', data)
      setStats(data)
    } catch (error) {
      console.error('Error loading data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 font-mono text-sm">{error}</p>
          </div>
          <div className="space-y-2 mb-6">
            <p className="text-sm text-gray-600"><strong>User:</strong> {user?.username || 'Not set'}</p>
            <p className="text-sm text-gray-600"><strong>User Type:</strong> {userType || 'Not set'}</p>
            <p className="text-sm text-gray-600"><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar */}
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">🏥 Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">✅ Admin Dashboard Loaded Successfully!</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-100 rounded-lg p-6">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-sm text-gray-600 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.total_patients || 0}</p>
            </div>

            <div className="bg-green-100 rounded-lg p-6">
              <div className="text-4xl mb-2">👨‍⚕️</div>
              <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
              <p className="text-3xl font-bold text-green-600">{stats?.total_doctors || 0}</p>
            </div>

            <div className="bg-purple-100 rounded-lg p-6">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.total_appointments || 0}</p>
            </div>

            <div className="bg-yellow-100 rounded-lg p-6">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-yellow-600">₹{stats?.total_revenue?.toLocaleString('en-IN') || 0}</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700 font-semibold">✅ Admin authentication is working correctly!</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/admin/users" className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="text-4xl mb-2">👥</div>
                <h4 className="font-bold text-gray-800">Manage Users</h4>
                <p className="text-sm text-gray-600">View all patients</p>
              </a>

              <a href="/admin/doctors" className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="text-4xl mb-2">👨‍⚕️</div>
                <h4 className="font-bold text-gray-800">Manage Doctors</h4>
                <p className="text-sm text-gray-600">View all doctors</p>
              </a>

              <a href="/admin/appointments" className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="text-4xl mb-2">📅</div>
                <h4 className="font-bold text-gray-800">Manage Appointments</h4>
                <p className="text-sm text-gray-600">View all appointments</p>
              </a>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2">Debug Information</h4>
            <div className="text-sm text-gray-600 space-y-1 font-mono">
              <p>User: {user?.username || 'Not set'}</p>
              <p>User Type: {userType || 'Not set'}</p>
              <p>Token: {localStorage.getItem('token') ? 'Present ✅' : 'Missing ❌'}</p>
              <p>Stats Loaded: {stats ? 'Yes ✅' : 'No ❌'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboardSimple
