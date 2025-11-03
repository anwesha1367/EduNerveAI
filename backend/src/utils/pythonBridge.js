import axios from 'axios'

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5001'

class PythonBridge {
  async speakQuestion(questionText) {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/tts/speak-question`, {
        question: questionText
      })
      return response.data
    } catch (error) {
      console.error('Error speaking question:', error.message)
      throw error
    }
  }

  async speakWarning(warningType) {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/tts/speak-warning`, {
        warning_type: warningType
      })
      return response.data
    } catch (error) {
      console.error('Error speaking warning:', error.message)
      throw error
    }
  }

  async startListening(sessionId) {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/stt/start-listening`, {
        session_id: sessionId
      })
      return response.data
    } catch (error) {
      console.error('Error starting listening:', error.message)
      throw error
    }
  }

  async stopListening(sessionId) {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/stt/stop-listening`, {
        session_id: sessionId
      })
      return response.data
    } catch (error) {
      console.error('Error stopping listening:', error.message)
      throw error
    }
  }

  async generateReport(reportData) {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/report/generate`, {
        report_data: reportData
      })
      return response.data
    } catch (error) {
      console.error('Error generating report:', error.message)
      throw error
    }
  }

  async generateQuestions(userProfile) {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/questions/generate`, {
        user_profile: userProfile
      })
      return response.data
    } catch (error) {
      console.error('Error generating questions:', error.message)
      throw error
    }
  }
}

export default new PythonBridge()
