import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user, userType, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard' },
    { to: '/patient/find-doctors', label: 'Find Doctors' },
    { to: '/patient/predict', label: 'AI Prediction' },
    { to: '/patient/appointments', label: 'Appointments' },
    { to: '/patient/profile', label: 'Profile' }
  ]

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard' },
    { to: '/doctor/profile', label: 'Profile' }
  ]

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/doctors', label: 'Doctors' },
    { to: '/admin/appointments', label: 'Appointments' }
  ]

  const links = userType === 'patient' ? patientLinks : userType === 'doctor' ? doctorLinks : adminLinks

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white flex items-center hover:scale-105 transition-transform">
            <span className="text-3xl mr-2">🏥</span> Eswatya Health Care
          </Link>
          
          <div className="flex items-center space-x-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all font-semibold"
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="ml-4 px-6 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-lg transform hover:scale-105"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
