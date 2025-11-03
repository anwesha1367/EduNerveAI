import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import interviewRoutes from './routes/interview.js'
import reportRoutes from './routes/report.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/report', reportRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'EduNerve AI API Server' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
