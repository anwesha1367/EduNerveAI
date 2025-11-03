import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useInterview } from '../hooks/useInterview'
import { useProctoring } from '../hooks/useProctoring'
import { getQuestions, submitInterview } from '../services/api'
import InterviewAvatar from '../components/interview/InterviewAvatar'
import QuestionCard from '../components/interview/QuestionCard'
import AnswerInput from '../components/interview/AnswerInput'
import ProctorMonitor from '../components/interview/ProctorMonitor'
import Button from '../components/common/Button'
import '../styles/interview.scss'

function Interview() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const { interviewState, startInterview, submitAnswer, endInterview, setReportData } = useInterview()
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

  const handleInterviewEnd = async () => {
    endInterview()
    
    try {
      const response = await submitInterview({
        answers: interviewState.answers,
        proctoring: interviewState.proctoring,
        startTime: interviewState.startTime,
        endTime: new Date()
      })
      
      setReportData(response.data.report)
      navigate('/report')
    } catch (error) {
      console.error('Failed to submit interview:', error)
    }
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
          <ProctorMonitor proctoring={interviewState.proctoring} />
        </div>

        <div className="interview-right" ref={questionRef}>
          {currentQuestion && (
            <>
              <QuestionCard question={currentQuestion} />
              <AnswerInput 
                onSubmit={handleAnswerSubmit}
                placeholder="Type your answer here..."
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Interview
