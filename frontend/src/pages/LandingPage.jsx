import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function LandingPage() {
  const { user, userType } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && userType) {
      navigate(userType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard')
    }
  }, [user, userType, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <nav className="relative z-10 bg-white bg-opacity-95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <span className="text-3xl mr-2">🏥</span> Eswatya Health Care
          </h1>
          <div className="space-x-4">
            <Link to="/login" className="px-6 py-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="text-8xl mb-6 animate-bounce">🏥</div>
          <h2 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            AI-Enhanced Healthcare System
          </h2>
          <p className="text-2xl text-white mb-10 drop-shadow-md">
            Intelligent Disease Prediction & Doctor Appointment Management
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-5 bg-white text-indigo-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl"
          >
            🚀 Get Started Now
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-3">
            <div className="text-6xl mb-6">🤖</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Disease Prediction</h3>
            <p className="text-gray-600 text-lg">
              Advanced machine learning model predicts diseases based on symptoms with high accuracy
            </p>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-3">
            <div className="text-6xl mb-6">👨‍⚕️</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Expert Doctors</h3>
            <p className="text-gray-600 text-lg">
              Book appointments with specialized doctors recommended by our AI system
            </p>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-3">
            <div className="text-6xl mb-6">💊</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Medication Guidance</h3>
            <p className="text-gray-600 text-lg">
              Get OTC medication recommendations based on predicted conditions
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-2xl shadow-2xl text-white">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-3">Easy Appointment Booking</h3>
            <p className="text-green-100 text-lg">
              Schedule appointments with available time slots and get instant confirmations
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-8 rounded-2xl shadow-2xl text-white">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-2xl font-bold mb-3">Secure Payments</h3>
            <p className="text-orange-100 text-lg">
              Multiple payment options including UPI, Card, Net Banking, and Cash
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-12">
          <h3 className="text-3xl font-bold text-center mb-10 text-gray-800">Why Choose Eswatya?</h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-indigo-600 mb-2">377+</div>
              <p className="text-gray-600 font-semibold">Symptoms Analyzed</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">8+</div>
              <p className="text-gray-600 font-semibold">Expert Doctors</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">95%</div>
              <p className="text-gray-600 font-semibold">Prediction Accuracy</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-600 mb-2">24/7</div>
              <p className="text-gray-600 font-semibold">AI Assistance</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white bg-opacity-95 backdrop-blur-md mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="text-lg">© 2024 Eswatya AI Health Care System. All rights reserved.</p>
          <p className="mt-2">Powered by Advanced Machine Learning & AI Technology</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
