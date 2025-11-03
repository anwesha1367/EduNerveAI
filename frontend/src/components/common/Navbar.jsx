import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from './Button'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  if (isAuthPage) return null

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-logo">🧠</span>
          <span className="brand-name">EduNerve AI</span>
        </Link>

        {user && (
          <div className="navbar-menu">
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
            <Link 
              to="/interview" 
              className={location.pathname === '/interview' ? 'active' : ''}
            >
              Interview
            </Link>
            <Link 
              to="/learning-path" 
              className={location.pathname === '/learning-path' ? 'active' : ''}
            >
              Learning Path
            </Link>
          </div>
        )}

        {user && (
          <div className="navbar-actions">
            <span className="user-name">{user.name}</span>
            <Button variant="secondary" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
