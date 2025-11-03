import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'
import './Login.css'
import './Signup.css'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    interests: [],
    skillLevel: 'beginner'
  })
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await signup(formData)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Signup failed')
    }
  }

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const interestOptions = ['Programming', 'Data Science', 'Web Development', 'AI/ML', 'Cloud']

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">🧠</div>
          <h1>Join EduNerve AI</h1>
          <p>Start your learning journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label>Interests</label>
            <div className="interest-chips">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  className={`chip ${formData.interests.includes(interest) ? 'active' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skillLevel">Skill Level</label>
            <select
              id="skillLevel"
              value={formData.skillLevel}
              onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup
