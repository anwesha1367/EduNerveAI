import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import gsap from 'gsap'
import StatsCard from '../components/dashboard/StatsCard'
import LearningPath from '../components/dashboard/LearningPath'
import Button from '../components/common/Button'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dashboardRef = useRef()

  useEffect(() => {
    if (dashboardRef.current) {
      gsap.from(dashboardRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      })
    }
  }, [])

  const stats = [
    { label: 'Interviews Completed', value: 3, color: '#FFC107' },
    { label: 'Average Score', value: '78%', color: '#FFB300' },
    { label: 'Skills Assessed', value: 12, color: '#FFA000' },
    { label: 'Learning Hours', value: '24h', color: '#FF8F00' }
  ]

  return (
    <div className="dashboard-page" ref={dashboardRef}>
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Ready to practice your next interview?</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/interview')}>
          Start New Interview
        </Button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-content">
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🎯</div>
              <div className="activity-details">
                <h3>Technical Interview</h3>
                <p>Completed 2 days ago • Score: 82%</p>
              </div>
              <Button variant="secondary" size="small">
                View Report
              </Button>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-details">
                <h3>Behavioral Interview</h3>
                <p>Completed 5 days ago • Score: 75%</p>
              </div>
              <Button variant="secondary" size="small">
                View Report
              </Button>
            </div>
          </div>
        </div>

        <LearningPath userId={user?.id} />
      </div>
    </div>
  )
}

export default Dashboard
