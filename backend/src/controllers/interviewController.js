import { questions } from '../data/questions.js'

export const getQuestions = (req, res) => {
  res.json({
    success: true,
    questions
  })
}

export const submitInterview = (req, res) => {
  const { answers, proctoring, startTime, endTime } = req.body

  // Mock report generation
  const report = {
    id: Date.now().toString(),
    overallScore: Math.floor(Math.random() * 30) + 70,
    summary: 'You demonstrated strong problem-solving skills and clear communication. Your technical knowledge is solid, with room for improvement in system design concepts.',
    strengths: [
      'Clear and structured problem-solving approach',
      'Good understanding of data structures',
      'Excellent communication skills',
      'Strong coding fundamentals'
    ],
    improvements: [
      'System design patterns could be deeper',
      'Consider edge cases more thoroughly',
      'Practice time complexity analysis',
      'Work on explaining trade-offs'
    ],
    skills: [
      { name: 'Problem Solving', score: 85 },
      { name: 'Data Structures', score: 78 },
      { name: 'Algorithms', score: 72 },
      { name: 'System Design', score: 65 },
      { name: 'Communication', score: 88 },
      { name: 'Code Quality', score: 80 }
    ],
    psychometrics: [
      {
        trait: 'Analytical Thinking',
        score: 82,
        description: 'You show strong ability to break down complex problems'
      },
      {
        trait: 'Creativity',
        score: 75,
        description: 'Good at finding alternative solutions'
      },
      {
        trait: 'Stress Management',
        score: 68,
        description: 'Room to improve performance under pressure'
      },
      {
        trait: 'Attention to Detail',
        score: 79,
        description: 'Generally thorough in your approach'
      }
    ]
  }

  res.json({
    success: true,
    report
  })
}
