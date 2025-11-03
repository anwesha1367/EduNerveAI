import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useInterview } from '../hooks/useInterview'
import { useProctoring } from '../hooks/useProctoring'
import { getQuestions } from '../services/api'
import InterviewAvatar from '../components/Interview/InterviewAvatar'
import QuestionCard from '../components/Interview/QuestionCard'
import AnswerInput from '../components/Interview/AnswerInput'
import CameraProctoring from '../components/Interview/CameraProctoring'
import './Interview.css'

function Interview() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const { interviewState, startInterview, submitAnswer, endInterview } = useInterview()
  useProctoring()
  const navigate = useNavigate()
  const questionRef = useRef()

  useEffect(() => {
    loadQuestions()
    startInterview()
  }, [])

  useEffect(() => {
    if (questionRef.current && questions.length > 0) {
      gsap.fromTo(questionRef.current, 
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, [interviewState.currentQuestion, questions])

  const loadQuestions = async () => {
    try {
      const response = await getQuestions()
      setQuestions(response.data.questions)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load questions:', error)
      setLoading(false)
    }
  }

  const handleAnswerSubmit = (answer) => {
    submitAnswer(answer)
    
    if (interviewState.currentQuestion >= questions.length - 1) {
      handleInterviewEnd()
    }
  }

  const handleInterviewEnd = () => {
    endInterview()
    navigate('/report')
  }

  const handleProctoringEvent = (eventType) => {
    console.log('Proctoring event:', eventType)
  }

  if (loading) {
    return <div className="loading-screen">Loading interview...</div>
  }

  const currentQuestion = questions[interviewState.currentQuestion]
  const progress = ((interviewState.currentQuestion + 1) / questions.length) * 100

  return (
    <div className="interview-page">
      <div className="interview-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="question-counter">
          Question {interviewState.currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="interview-content">
        <div className="interview-left">
          <InterviewAvatar speaking={true} />
          <CameraProctoring onProctoringEvent={handleProctoringEvent} />
        </div>

        <div className="interview-right" ref={questionRef}>
          {currentQuestion && (
            <>
              <QuestionCard question={currentQuestion} />
              <AnswerInput onSubmit={handleAnswerSubmit} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Interview
