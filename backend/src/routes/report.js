import express from 'express'
import { generateReport, getReport } from '../controllers/reportController.js'

const router = express.Router()

router.post('/generate', generateReport)
router.get('/:reportId', getReport)

export default router
