import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:5001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth
export const login = (credentials) => api.post('/auth/login', credentials)
export const signup = (userData) => api.post('/auth/signup', userData)

// Interview
export const getQuestions = () => api.get('/interview/questions')
export const submitInterview = (interviewData) => api.post('/interview/submit', interviewData)

// Personalized Questions
export const getPersonalizedQuestions = (userProfile) => 
  api.post('/questions/personalized', userProfile)

// Python Services
export const speakQuestion = (question) => 
  api.post('/python/speak-question', { question })

export const speakWarning = (warningType) => 
  api.post('/python/speak-warning', { warningType })

export const startListening = (sessionId) => 
  api.post('/python/start-listening', { sessionId })

export const stopListening = (sessionId) => 
  api.post('/python/stop-listening', { sessionId })

// Report
export const generateReport = (reportData) => 
  axios.post(`${PYTHON_API_URL}/report/generate`, { report_data: reportData })

export const downloadReport = (filename) => 
  `${PYTHON_API_URL}/report/download/${filename}`

export default api
