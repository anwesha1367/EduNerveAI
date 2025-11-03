import express from 'express'
import { 
  speakQuestion, 
  speakWarning, 
  startListening, 
  stopListening 
} from '../controllers/pythonController.js'

const router = express.Router()

router.post('/speak-question', speakQuestion)
router.post('/speak-warning', speakWarning)
router.post('/start-listening', startListening)
router.post('/stop-listening', stopListening)

export default router
