import { useState } from 'react'
import Button from '../common/Button'
import './AnswerInput.css'

function AnswerInput({ onSubmit }) {
  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer)
      setAnswer('')
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setAnswer(prev => prev + ' [Voice input simulated]')
        setIsRecording(false)
      }, 2000)
    }
  }

  return (
    <div className="answer-input">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows={6}
      />
      <div className="input-actions">
        <button 
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleVoiceInput}
          type="button"
        >
          {isRecording ? '🎙️ Recording...' : '🎤 Voice Input'}
        </button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!answer.trim()}
        >
          Submit Answer
        </Button>
      </div>
    </div>
  )
}

export default AnswerInput
