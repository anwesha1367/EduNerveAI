import pythonBridge from '../utils/pythonBridge.js'

export const speakQuestion = async (req, res) => {
  try {
    const { question } = req.body
    const result = await pythonBridge.speakQuestion(question)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const speakWarning = async (req, res) => {
  try {
    const { warningType } = req.body
    const result = await pythonBridge.speakWarning(warningType)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const startListening = async (req, res) => {
  try {
    const { sessionId } = req.body
    const result = await pythonBridge.startListening(sessionId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const stopListening = async (req, res) => {
  try {
    const { sessionId } = req.body
    const result = await pythonBridge.stopListening(sessionId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
