import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../hooks/useAuth'
import { generateReport, downloadReport } from '../services/api'
import ReportCard from '../components/report/ReportCard'
import SkillsChart from '../components/report/SkillsChart'
import Button from '../components/common/Button'
import './Report.css'

function Report() {
  const { interviewState } = useInterview()
  const { user } = useAuth()
  const navigate = useNavigate()
  const reportRef = useRef()
  const [reportData, setReportData] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!interviewState.endTime) {
      navigate('/dashboard')
      return
    }

    // Generate mock report data
    const mockReport = {
      candidate_name: user?.name || 'User',
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      duration: '30 minutes',
      overall_score: Math.floor(Math.random() * 30) + 70,
      summary: 'You demonstrated strong problem-solving skills and clear communication. Your technical knowledge is solid, with room for improvement in some areas.',
      strengths: [
        'Clear and structured problem-solving approach',
        'Good understanding of data structures',
        'Excellent communication skills',
        'Strong coding fundamentals'
      ],
      improvements: [
        'System design patterns could be deeper',
        'Consider edge cases more thoroughly',
        'Practice time complexity analysis'
      ],
      skills: [
        { name: 'Problem Solving', score: 85 },
        { name: 'Data Structures', score: 78 },
        { name: 'Algorithms', score: 72 },
        { name: 'System Design', score: 65 },
        { name: 'Communication', score: 88 },
        { name: 'Code Quality', score: 80 }
      ],
      psychometrics: [
        { trait: 'Analytical Thinking', score: 82, description: 'Strong ability to break down problems' },
        { trait: 'Creativity', score: 75, description: 'Good at finding alternative solutions' },
        { trait: 'Confidence', score: 70, description: 'Generally confident' },
        { trait: 'Communication', score: 85, description: 'Excellent verbal skills' },
        { trait: 'Technical Knowledge', score: 76, description: 'Solid foundation' }
      ],
      proctoring: interviewState.proctoring
    }

    setReportData(mockReport)

    // Animate report sections
    if (reportRef.current) {
      gsap.from(reportRef.current.querySelectorAll('.report-section'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out'
      })
    }
  }, [])

  const handleDownloadPDF = async () => {
    if (!reportData) return

    setGenerating(true)
    try {
      const response = await generateReport(reportData)
      const url = downloadReport(response.data.filename)
      
      // Open download in new tab
      window.open(url, '_blank')
      
      setDownloadUrl(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF report. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (!reportData) {
    return <div className="loading-screen">Generating report...</div>
  }

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
              <div className="score">{reportData.overall_score}%</div>
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
          onClick={handleDownloadPDF}
          disabled={generating}
        >
          {generating ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/learning-path')}
        >
          View Learning Path
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
