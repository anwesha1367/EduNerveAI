import pythonBridge from '../utils/pythonBridge.js'

export const getPersonalizedQuestions = async (req, res) => {
  try {
    const { interests, skillLevel, numQuestions } = req.body

    const userProfile = {
      interests: interests || ['Programming'],
      skill_level: skillLevel || 'intermediate',
      num_questions: numQuestions || 5
    }

    const result = await pythonBridge.generateQuestions(userProfile)

    res.json({
      success: true,
      questions: result.questions
    })
  } catch (error) {
    console.error('Error generating personalized questions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions'
    })
  }
}
