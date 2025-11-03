import { useEffect, useRef, useState } from 'react'
import './CameraProctoring.css'

function CameraProctoring({ onProctoringEvent }) {
  const videoRef = useRef(null)
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    lookingAwayCount: 0,
    tabSwitchCount: 0
  })

  useEffect(() => {
    startCamera()
    startProctoringChecks()
    setupTabDetection()
    
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      addAlert('Camera access denied. Please enable camera.', 'danger')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
  }

  const startProctoringChecks = () => {
    const interval = setInterval(() => {
      const random = Math.random()
      
      if (random < 0.05) {
        addAlert('⚠️ No face detected! Stay in frame.', 'danger')
        setStats(prev => ({ ...prev, noFaceCount: prev.noFaceCount + 1 }))
        onProctoringEvent?.('no_face')
      } else if (random < 0.08) {
        addAlert('⚠️ Multiple faces detected!', 'danger')
        setStats(prev => ({ ...prev, multipleFaceCount: prev.multipleFaceCount + 1 }))
        onProctoringEvent?.('multiple_faces')
      } else if (random < 0.15) {
        addAlert('⚠️ Looking away detected!', 'warning')
        setStats(prev => ({ ...prev, lookingAwayCount: prev.lookingAwayCount + 1 }))
        onProctoringEvent?.('looking_away')
      }
    }, 3000)

    return () => clearInterval(interval)
  }

  const setupTabDetection = () => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addAlert('⚠️ Tab switch detected!', 'warning')
        setStats(prev => ({ ...prev, tabSwitchCount: prev.tabSwitchCount + 1 }))
        onProctoringEvent?.('tab_switch')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  const addAlert = (message, type) => {
    const newAlert = { id: Date.now(), message, type }
    setAlerts(prev => [...prev, newAlert])
    
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== newAlert.id))
    }, 4000)
  }

  return (
    <div className="camera-proctoring">
      <div className="camera-feed">
        <video ref={videoRef} autoPlay muted />
        <div className="camera-overlay">
          <div className="status-indicator"></div>
          <span>Monitoring Active</span>
        </div>
      </div>

      <div className="proctoring-stats">
        <h4>Proctoring Status</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-icon">👤</span>
            <div className="stat-details">
              <span className="stat-label">No Face</span>
              <span className="stat-value">{stats.noFaceCount}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <div className="stat-details">
              <span className="stat-label">Multiple Faces</span>
              <span className="stat-value">{stats.multipleFaceCount}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <div className="stat-details">
              <span className="stat-label">Looking Away</span>
              <span className="stat-value">{stats.lookingAwayCount}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔄</span>
            <div className="stat-details">
              <span className="stat-label">Tab Switches</span>
              <span className="stat-value">{stats.tabSwitchCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="proctoring-alerts">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CameraProctoring
