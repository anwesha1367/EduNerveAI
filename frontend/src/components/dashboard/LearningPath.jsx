import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import './LearningPath.css'

function LearningPath() {
  const navigate = useNavigate()

  const recommendations = [
    { title: 'Advanced Data Structures', progress: 60 },
    { title: 'System Design Patterns', progress: 30 },
    { title: 'Communication Skills', progress: 80 }
  ]

  return (
    <div className="learning-path-widget">
      <h2>Your Learning Path</h2>
      <div className="recommendations">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-item">
            <h3>{rec.title}</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${rec.progress}%` }} />
            </div>
            <span className="progress-text">{rec.progress}% Complete</span>
          </div>
        ))}
      </div>
      <Button variant="primary" fullWidth onClick={() => navigate('/learning-path')}>
        View Full Learning Path
      </Button>
    </div>
  )
}

export default LearningPath
