import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { InterviewProvider } from './context/InterviewContext'
import Navbar from './components/common/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './Pages/Dashboard'
import Interview from './pages/Interview'
import Report from './pages/Report'
import LearningPath from './pages/LearningPath'
import { useAuth } from './hooks/useAuth'
import './App.css'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/interview" 
                element={
                  <ProtectedRoute>
                    <Interview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/report" 
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learning-path-page" 
                element={
                  <ProtectedRoute>
                    <LearningPath />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
