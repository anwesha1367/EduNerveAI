import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'
import './Login.css'

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await login(credentials)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">🧠</div>
          <h1>Welcome Back</h1>
          <p>Login to EduNerve AI</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Login
          </Button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
