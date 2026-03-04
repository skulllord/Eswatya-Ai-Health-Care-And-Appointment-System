import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSymptoms, predictDisease, getDoctors, createAppointment } from '../services/api'
import Navbar from '../components/Navbar'

function PredictionPage() {
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadSymptoms()
  }, [])

  const loadSymptoms = async () => {
    try {
      const data = await getSymptoms()
      setSymptoms(data.symptoms)
    } catch (error) {
      console.error('Error loading symptoms:', error)
    }
  }

  const filteredSymptoms = symptoms.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(s)
  )

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) return
    
    setLoading(true)
    try {
      const result = await predictDisease(selectedSymptoms)
      setPrediction(result)
      
      // Get doctors for the top prediction's specialist
      const topPrediction = result.predictions[0]
      const doctorList = await getDoctors(topPrediction.specialist)
      setDoctors(doctorList)
    } catch (error) {
      console.error('Prediction error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async (doctorId, selectedPrediction) => {
    if (!appointmentDate) {
      alert('Please select appointment date and time')
      return
    }

    try {
      await createAppointment({
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        symptoms: selectedSymptoms,
        predicted_disease: selectedPrediction.disease,
        confidence_score: selectedPrediction.confidence
      })
      alert('Appointment booked successfully!')
      navigate('/patient/appointments')
    } catch (error) {
      alert('Failed to book appointment')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Disease Prediction</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Your Symptoms</h2>
          
          <input
            type="text"
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-medical-primary focus:outline-none mb-4"
          />

          {searchTerm && filteredSymptoms.length > 0 && (
            <div className="border-2 border-gray-200 rounded-lg max-h-60 overflow-y-auto mb-4">
              {filteredSymptoms.slice(0, 10).map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => {
                    setSelectedSymptoms([...selectedSymptoms, symptom])
                    setSearchTerm('')
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-medical-light transition-colors border-b border-gray-100"
                >
                  {symptom}
                </button>
              ))}
            </div>
          )}

          {selectedSymptoms.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Symptoms ({selectedSymptoms.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="inline-flex items-center gap-2 bg-medical-primary text-white px-3 py-1 rounded-full text-sm"
                  >
                    {symptom}
                    <button
                      onClick={() => setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))}
                      className="hover:bg-medical-dark rounded-full p-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={loading || selectedSymptoms.length === 0}
            className="w-full bg-medical-primary text-white py-3 rounded-lg font-semibold hover:bg-medical-dark transition-colors disabled:bg-gray-300"
          >
            {loading ? 'Analyzing...' : 'Predict Disease'}
          </button>
        </div>

        {prediction && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 3 Prediction Results</h2>
              
              <div className="space-y-4">
                {prediction.predictions.map((pred, index) => (
                  <div 
                    key={index} 
                    className={`border-2 rounded-lg p-4 ${
                      index === 0 ? 'border-medical-primary bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-2xl font-bold ${
                            index === 0 ? 'text-medical-primary' : 'text-gray-600'
                          }`}>
                            #{index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800">{pred.disease}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Recommended Specialist: <span className="font-semibold text-medical-primary">{pred.specialist}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Confidence</p>
                        <p className="text-2xl font-bold text-medical-primary">
                          {(pred.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-medical-primary' : 'bg-gray-400'
                        }`}
                        style={{ width: `${pred.confidence * 100}%` }}
                      />
                    </div>
                    
                    {index === 0 && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                        <span>✓</span>
                        <span className="font-semibold">Most Likely Diagnosis</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {prediction.medications && prediction.medications.length > 0 && (
                <div className="mt-6 bg-blue-50 border-l-4 border-medical-primary p-4 rounded">
                  <p className="font-semibold mb-2">💊 Suggested OTC Medications (for top prediction):</p>
                  {prediction.medications.map((med, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        {med.dosage} - {med.frequency} for {med.duration}
                      </p>
                    </div>
                  ))}
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ This is not a substitute for professional medical advice
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Book Appointment with Specialist</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-medical-primary focus:outline-none"
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Showing doctors for: <span className="font-semibold text-medical-primary">
                  {prediction.predictions[0].specialist}
                </span>
              </p>

              {doctors.length > 0 ? (
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
                      <p className="text-gray-600">{doctor.specialization}</p>
                      <p className="text-sm text-gray-500">{doctor.qualification}</p>
                      <p className="text-sm text-gray-500">{doctor.experience_years} years experience</p>
                      <p className="text-medical-primary font-semibold mt-2">
                        Fee: ₹{doctor.consultation_fee.toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => handleBookAppointment(doctor.id, prediction.predictions[0])}
                        className="mt-3 px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-dark transition-colors"
                      >
                        Book Appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No doctors available for this specialization</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default PredictionPage
