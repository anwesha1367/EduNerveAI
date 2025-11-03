import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials)
export const signup = (userData) => api.post('/auth/signup', userData)

// Interview endpoints
export const getQuestions = () => api.get('/interview/questions')
export const submitInterview = (interviewData) => api.post('/interview/submit', interviewData)

// Report endpoints
export const generateReport = (interviewId) => api.post('/report/generate', { interviewId })
export const getReport = (reportId) => api.get(`/report/${reportId}`)

// Learning path endpoints
export const getLearningPath = (userId) => api.get(`/learning-path/${userId}`)

export default api
