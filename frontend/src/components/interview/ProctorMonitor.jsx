import { useEffect, useRef, useState } from 'react'
import { speakWarning } from '../../services/api'
import './ProctorMonitor.css'

function ProctorMonitor({ onViolation }) {
  const [violations, setViolations] = useState({
    noFace: 0,
    multipleFaces: 0,
    lookingAway: 0,
    tabSwitches: 0
  })
  const [currentAlert, setCurrentAlert] = useState(null)
  const [overallStatus, setOverallStatus] = useState('good') // good, warning, critical

  useEffect(() => {
    // Calculate overall status based on violations
    const totalViolations = Object.values(violations).reduce((a, b) => a + b, 0)
    
    if (totalViolations === 0) {
      setOverallStatus('good')
    } else if (totalViolations < 5) {
      setOverallStatus('warning')
    } else {
      setOverallStatus('critical')
    }
  }, [violations])

  const addViolation = (type) => {
    setViolations(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }))

    // Show alert
    const alertMessages = {
      noFace: '⚠️ No face detected! Stay in frame.',
      multipleFaces: '🚫 Multiple people detected!',
      lookingAway: '👁️ Please look at the camera.',
      tabSwitches: '⚠️ Tab switching detected!'
    }

    setCurrentAlert({
      type,
      message: alertMessages[type],
      timestamp: Date.now()
    })

    // Speak warning
    speakWarning(type).catch(err => console.error('TTS Error:', err))

    // Notify parent
    onViolation?.(type, violations[type] + 1)

    // Clear alert after 4 seconds
    setTimeout(() => {
      setCurrentAlert(null)
    }, 4000)
  }

  // Expose method to parent via ref (if needed)
  useEffect(() => {
    // Can be called from parent component
    window.addProctoringViolation = addViolation
    
    return () => {
      delete window.addProctoringViolation
    }
  }, [violations])

  const getStatusColor = () => {
    switch (overallStatus) {
      case 'good': return '#4CAF50'
      case 'warning': return '#FF9800'
      case 'critical': return '#FF4444'
      default: return '#CCCCCC'
    }
  }

  const getStatusText = () => {
    switch (overallStatus) {
      case 'good': return 'All Good'
      case 'warning': return 'Minor Issues'
      case 'critical': return 'Critical Violations'
      default: return 'Unknown'
    }
  }

  return (
    <div className="proctor-monitor">
      <div className="monitor-header">
        <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}>
          <div className="pulse-ring" />
        </div>
        <div className="status-text">
          <h3>Monitoring Status</h3>
          <p className={`status-label status-${overallStatus}`}>{getStatusText()}</p>
        </div>
      </div>

      <div className="violations-grid">
        <div className="violation-card">
          <div className="violation-icon">👤</div>
          <div className="violation-info">
            <span className="violation-label">No Face</span>
            <span className="violation-count">{violations.noFace}</span>
          </div>
        </div>

        <div className="violation-card">
          <div className="violation-icon">👥</div>
          <div className="violation-info">
            <span className="violation-label">Multiple Faces</span>
            <span className="violation-count">{violations.multipleFaces}</span>
          </div>
        </div>

        <div className="violation-card">
          <div className="violation-icon">👁️</div>
          <div className="violation-info">
            <span className="violation-label">Looking Away</span>
            <span className="violation-count">{violations.lookingAway}</span>
          </div>
        </div>

        <div className="violation-card">
          <div className="violation-icon">🔄</div>
          <div className="violation-info">
            <span className="violation-label">Tab Switches</span>
            <span className="violation-count">{violations.tabSwitches}</span>
          </div>
        </div>
      </div>

      {currentAlert && (
        <div className={`proctor-alert alert-${overallStatus}`}>
          <span className="alert-icon">⚠️</span>
          <span className="alert-message">{currentAlert.message}</span>
        </div>
      )}

      <div className="monitor-tips">
        <h4>Proctoring Tips:</h4>
        <ul>
          <li>Stay centered in the camera frame</li>
          <li>Maintain eye contact with the camera</li>
          <li>Avoid switching tabs or windows</li>
          <li>Ensure only you are visible on camera</li>
        </ul>
      </div>
    </div>
  )
}

export default ProctorMonitor
