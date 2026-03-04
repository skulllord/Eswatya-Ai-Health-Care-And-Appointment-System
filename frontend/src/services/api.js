import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (username, password, userType) => {
  const response = await api.post('/auth/login', {
    username,
    password,
    user_type: userType
  })
  return response.data
}

export const registerPatient = async (userData) => {
  const response = await api.post('/auth/register/patient', userData)
  return response.data
}

export const registerDoctor = async (doctorData) => {
  const response = await api.post('/auth/register/doctor', doctorData)
  return response.data
}

export const register = async (userData, userType) => {
  if (userType === 'patient') {
    return registerPatient(userData)
  } else {
    return registerDoctor(userData)
  }
}

export const getPatientProfile = async () => {
  const response = await api.get('/patient/profile')
  return response.data
}

export const updatePatientProfile = async (profileData) => {
  const response = await api.put('/patient/profile', profileData)
  return response.data
}

export const getMedicalHistory = async () => {
  const response = await api.get('/medical-history')
  return response.data
}

export const getSymptoms = async () => {
  const response = await api.get('/symptoms')
  return response.data
}

export const predictDisease = async (symptoms) => {
  const response = await api.post('/predict', { symptoms })
  return response.data
}

export const getDoctors = async (specialization = null) => {
  const params = specialization ? { specialization } : {}
  const response = await api.get('/doctors', { params })
  return response.data
}

export const getDoctorAppointments = async () => {
  const response = await api.get('/doctor/appointments')
  return response.data
}

export const updateAppointment = async (appointmentId, updateData) => {
  const response = await api.put(`/doctor/appointment/${appointmentId}`, updateData)
  return response.data
}

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData)
  return response.data
}

export const getPatientAppointments = async () => {
  const response = await api.get('/appointments')
  return response.data
}

export const cancelAppointment = async (appointmentId) => {
  const response = await api.put(`/appointments/${appointmentId}/cancel`)
  return response.data
}

export default api


// ============= Admin APIs =============

export const getSystemStats = async () => {
  const response = await api.get('/admin/stats')
  return response.data
}

export const getAllAppointmentsAdmin = async () => {
  const response = await api.get('/admin/appointments')
  return response.data
}

export const getAllDoctorsAdmin = async () => {
  const response = await api.get('/admin/doctors')
  return response.data
}

export const addDoctorAdmin = async (doctorData) => {
  const response = await api.post('/admin/doctors', doctorData)
  return response.data
}

export const deleteDoctorAdmin = async (doctorId) => {
  const response = await api.delete(`/admin/doctors/${doctorId}`)
  return response.data
}

// ============= Doctor Profile APIs =============

export const getDoctorProfile = async () => {
  const response = await api.get('/doctor/profile')
  return response.data
}

export const updateDoctorProfile = async (profileData) => {
  const response = await api.put('/doctor/profile', profileData)
  return response.data
}

// ============= Time Slots APIs =============

export const getDoctorTimeSlots = async (doctorId, date = null) => {
  const params = date ? { date } : {}
  const response = await api.get(`/doctors/${doctorId}/slots`, { params })
  return response.data
}

// ============= Payment APIs =============

export const createPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData)
  return response.data
}

export const getPayment = async (appointmentId) => {
  const response = await api.get(`/payments/${appointmentId}`)
  return response.data
}


// ============= Admin User Management APIs =============

export const getAllUsersAdmin = async () => {
  const response = await api.get('/admin/users')
  return response.data
}

export const deleteUserAdmin = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`)
  return response.data
}
