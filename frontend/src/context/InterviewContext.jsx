import { createContext, useState } from 'react'

export const InterviewContext = createContext()

export function InterviewProvider({ children }) {
  const [interviewState, setInterviewState] = useState({
    currentQuestion: 0,
    answers: [],
    startTime: null,
    endTime: null,
    proctoring: {
      faceDetected: true,
      tabChanges: 0,
      copyPasteAttempts: 0,
      noFaceCount: 0,
      multipleFaceCount: 0,
      lookingAwayCount: 0
    }
  })

  const startInterview = () => {
    setInterviewState(prev => ({
      ...prev,
      startTime: new Date(),
      currentQuestion: 0,
      answers: []
    }))
  }

  const submitAnswer = (answer) => {
    setInterviewState(prev => ({
      ...prev,
      answers: [...prev.answers, {
        questionId: prev.currentQuestion,
        answer,
        timestamp: new Date()
      }],
      currentQuestion: prev.currentQuestion + 1
    }))
  }

  const endInterview = () => {
    setInterviewState(prev => ({
      ...prev,
      endTime: new Date()
    }))
  }

  const updateProctoring = (updates) => {
    setInterviewState(prev => ({
      ...prev,
      proctoring: {
        ...prev.proctoring,
        ...updates
      }
    }))
  }

  return (
    <InterviewContext.Provider 
      value={{ 
        interviewState, 
        startInterview, 
        submitAnswer, 
        endInterview,
        updateProctoring 
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}
