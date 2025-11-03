import express from 'express'
import { getPersonalizedQuestions } from '../controllers/questionsController.js'

const router = express.Router()

router.post('/personalized', getPersonalizedQuestions)

export default router
