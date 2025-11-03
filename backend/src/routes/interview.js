import express from 'express'
import { getQuestions, submitInterview } from '../controllers/interviewController.js'

const router = express.Router()

router.get('/questions', getQuestions)
router.post('/submit', submitInterview)

export default router
