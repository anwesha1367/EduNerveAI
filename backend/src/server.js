import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import interviewRoutes from './routes/interview.js'
import reportRoutes from './routes/report.js'
import questionsRoutes from './routes/questions.js'
import pythonRoutes from './routes/python.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/questions', questionsRoutes)
app.use('/api/python', pythonRoutes)

app.get('/', (req, res) => {
  res.json({ 
    message: 'EduNerve AI API Server',
    status: 'running',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      interview: '/api/interview',
      report: '/api/report',
      questions: '/api/questions',
      python: '/api/python'
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Python API: ${process.env.PYTHON_API_URL || 'http://localhost:5001'}`)
})
