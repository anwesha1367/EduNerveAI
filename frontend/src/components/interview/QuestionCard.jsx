import './QuestionCard.scss'

function QuestionCard({ question }) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-category">{question.category}</span>
        <span className="question-difficulty">{question.difficulty}</span>
      </div>
      <h2 className="question-text">{question.text}</h2>
      {question.context && (
        <p className="question-context">{question.context}</p>
      )}
    </div>
  )
}

export default QuestionCard
