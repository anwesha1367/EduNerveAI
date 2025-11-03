import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useInterview } from '../hooks/useInterview'
import ReportCard from '../components/report/ReportCard'
import SkillsChart from '../components/report/SkillsChart'
import Button from '../components/common/Button'
import '../styles/report.scss'

function Report() {
  const { reportData } = useInterview()
  const navigate = useNavigate()
  const reportRef = useRef()

  useEffect(() => {
    if (!reportData) {
      navigate('/dashboard')
      return
    }

    // Animate report sections
    gsap.from(reportRef.current.querySelectorAll('.report-section'), {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.3,
      ease: 'power3.out'
    })
  }, [reportData, navigate])

  if (!reportData) return null

  return (
    <div className="report-page" ref={reportRef}>
      <div className="report-header report-section">
        <h1>Interview Performance Report</h1>
        <p>Here's your detailed analysis</p>
      </div>

      <div className="report-section">
        <ReportCard title="Overall Summary">
          <div className="summary-content">
            <div className="score-circle">
              <div className="score">{reportData.overallScore}%</div>
              <p>Overall Score</p>
            </div>
            <div className="summary-text">
              <p>{reportData.summary}</p>
            </div>
          </div>
        </ReportCard>
      </div>

      <div className="report-grid report-section">
        <ReportCard title="Strengths">
          <ul className="strength-list">
            {reportData.strengths.map((strength, index) => (
              <li key={index}>
                <span className="strength-icon">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </ReportCard>

        <ReportCard title="Areas for Improvement">
          <ul className="improvement-list">
            {reportData.improvements.map((improvement, index) => (
              <li key={index}>
                <span className="improvement-icon">→</span>
                {improvement}
              </li>
            ))}
          </ul>
        </ReportCard>
      </div>

      <div className="report-section">
        <ReportCard title="Performance Analysis">
          <SkillsChart data={reportData.skills} />
        </ReportCard>
      </div>

      <div className="report-section">
        <ReportCard title="Psychometric Insights">
          <div className="insights-grid">
            {reportData.psychometrics.map((insight, index) => (
              <div key={index} className="insight-card">
                <h3>{insight.trait}</h3>
                <div className="insight-bar">
                  <div 
                    className="insight-fill" 
                    style={{ width: `${insight.score}%` }}
                  />
                </div>
                <p>{insight.description}</p>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      <div className="report-actions report-section">
        <Button 
          variant="primary" 
          onClick={() => navigate('/learning-path')}
        >
          View Learning Recommendations
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default Report
