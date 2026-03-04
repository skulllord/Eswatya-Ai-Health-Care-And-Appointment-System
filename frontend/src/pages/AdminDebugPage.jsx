import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AdminDebugPage() {
  const { user, userType, token, logout } = useAuth()
  const navigate = useNavigate()

  const storedToken = localStorage.getItem('token')
  const storedUserType = localStorage.getItem('userType')
  const storedUser = localStorage.getItem('user')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Admin Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">AuthContext State</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>user:</strong> {JSON.stringify(user, null, 2)}</p>
            <p><strong>userType:</strong> {userType || 'null'}</p>
            <p><strong>token:</strong> {token ? token.substring(0, 50) + '...' : 'null'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">localStorage Values</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>token:</strong> {storedToken ? storedToken.substring(0, 50) + '...' : 'null'}</p>
            <p><strong>userType:</strong> {storedUserType || 'null'}</p>
            <p><strong>user:</strong> {storedUser || 'null'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Status Check</h2>
          <div className="space-y-2">
            <p className={user ? 'text-green-600' : 'text-red-600'}>
              {user ? '✅' : '❌'} User object exists
            </p>
            <p className={userType ? 'text-green-600' : 'text-red-600'}>
              {userType ? '✅' : '❌'} UserType is set
            </p>
            <p className={userType === 'admin' ? 'text-green-600' : 'text-red-600'}>
              {userType === 'admin' ? '✅' : '❌'} UserType is "admin"
            </p>
            <p className={token ? 'text-green-600' : 'text-red-600'}>
              {token ? '✅' : '❌'} Token exists
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => logout()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDebugPage
