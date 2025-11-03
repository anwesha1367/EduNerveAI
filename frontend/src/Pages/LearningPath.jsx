import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPersonalizedQuestions } from '../services/api'
import Button from '../components/common/Button'
import './LearningPath.css'

gsap.registerPlugin(ScrollTrigger)

function LearningPath() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const pathRef = useRef()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [mockTests, setMockTests] = useState([])
  const [loading, setLoading] = useState(false)

  // INLINE STYLES FOR VISIBILITY
  const pageStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2.5rem 2rem',
    minHeight: 'calc(100vh - 70px)',
    background: '#E5E5E5'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2.5rem'
  }

  const h1Style = {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    color: '#000000',
    fontWeight: '700'
  }

  const pStyle = {
    fontSize: '1.1rem',
    color: '#666666'
  }

  const bannerStyle = {
    background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
    borderRadius: '16px',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '3rem',
    boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
  }

  const bannerIconStyle = {
    fontSize: '3rem',
    flexShrink: 0
  }

  const bannerContentStyle = {
    flex: 1
  }

  const h2Style = {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#000000',
    fontWeight: '700'
  }

  const bannerPStyle = {
    color: '#1A1A1A',
    fontSize: '1rem'
  }

  const sectionStyle = {
    marginBottom: '3rem'
  }

  const subtitleStyle = {
    color: '#666666',
    fontSize: '1rem',
    marginBottom: '2rem'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  }

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '2px solid #E0E0E0',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  }

  const h3Style = {
    fontSize: '1.25rem',
    color: '#000000',
    fontWeight: '600',
    flex: 1
  }

  const badgeStyle = {
    padding: '0.375rem 0.875rem',
    background: '#FFF9E6',
    border: '1px solid #FFC107',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#996B00',
    textTransform: 'capitalize'
  }

  const testInfoStyle = {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    color: '#666666',
    fontSize: '0.95rem'
  }

  const previewStyle = {
    marginBottom: '1.5rem'
  }

  const previewTextStyle = {
    background: '#F8F8F8',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#333333',
    lineHeight: '1.6',
    borderLeft: '3px solid #FFC107'
  }

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2rem'
  }

  useEffect(() => {
    const cards = pathRef.current?.querySelectorAll('.course-card')
    
    cards?.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: index * 0.1
      })
    })
  }, [])

  useEffect(() => {
    loadMockTests()
  }, [user])

  const loadMockTests = async () => {
    if (!user?.interests) {
      // Set fallback mock tests
      setMockTests([
        {
          id: 1,
          title: 'Programming Fundamentals',
          questions: [{ text: 'What is the difference between let and var in JavaScript?', category: 'Programming', difficulty: 'intermediate' }],
          duration: '15 min',
          difficulty: 'intermediate'
        },
        {
          id: 2,
          title: 'Advanced Technical Concepts',
          questions: [{ text: 'Explain the event loop in Node.js', category: 'Technical', difficulty: 'advanced' }],
          duration: '20 min',
          difficulty: 'advanced'
        }
      ])
      return
    }
    
    setLoading(true)
    try {
      const response = await getPersonalizedQuestions({
        interests: user.interests,
        skillLevel: user.skillLevel || 'intermediate',
        numQuestions: 10
      })
      
      const tests = [
        {
          id: 1,
          title: `${user.interests || 'Programming'} Fundamentals`,
          questions: response.data.questions.slice(0, 5),
          duration: '15 min',
          difficulty: user.skillLevel || 'intermediate'
        },
        {
          id: 2,
          title: `Advanced ${user.interests || 'Technical'} Concepts`,
          questions: response.data.questions.slice(5, 10),
          duration: '20 min',
          difficulty: 'advanced'
        }
      ]
      
      setMockTests(tests)
    } catch (error) {
      console.error('Error loading mock tests:', error)
      setMockTests([
        {
          id: 1,
          title: 'Programming Fundamentals',
          questions: [{ text: 'Sample programming question', category: 'Programming', difficulty: 'intermediate' }],
          duration: '15 min',
          difficulty: 'intermediate'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = (test) => {
    sessionStorage.setItem('current_test', JSON.stringify(test))
    navigate('/interview')
  }

  const courses = [
    {
      id: 1,
      title: 'Advanced Data Structures',
      description: 'Master complex data structures based on your interview performance',
      duration: '6 weeks',
      level: 'Intermediate',
      skills: ['Trees', 'Graphs', 'Hash Tables'],
      relevance: 'High - based on your interview gaps',
      color: '#FFC107'
    },
    {
      id: 2,
      title: 'System Design Fundamentals',
      description: 'Learn to design scalable systems',
      duration: '8 weeks',
      level: 'Advanced',
      skills: ['Architecture', 'Scalability', 'Databases'],
      relevance: 'Medium - recommended for growth',
      color: '#FFB300'
    },
    {
      id: 3,
      title: 'Communication Skills for Tech',
      description: 'Improve your technical communication',
      duration: '4 weeks',
      level: 'All Levels',
      skills: ['Presentation', 'Clarity', 'Confidence'],
      relevance: 'High - improve interview performance',
      color: '#FFA000'
    }
  ]

  return (
    <div style={pageStyle} ref={pathRef}>
      <div style={headerStyle}>
        <h1 style={h1Style}>Personalized Learning Path</h1>
        <p style={pStyle}>Hey {user?.name || 'User'}! Based on your profile, here's your recommended journey</p>
      </div>

      <div style={bannerStyle}>
        <div style={bannerIconStyle}>🎯</div>
        <div style={bannerContentStyle}>
          <h2 style={{ ...h2Style, fontSize: '1.5rem' }}>Your Focus Areas</h2>
          <p style={bannerPStyle}>
            Based on your interests: <strong style={{ color: '#000000', fontWeight: '700' }}>
              {user?.interests?.join(', ') || 'Programming, Web Development'}
            </strong>
          </p>
        </div>
      </div>

      {/* Mock Tests Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Personalized Mock Tests</h2>
        <p style={subtitleStyle}>Practice with questions tailored to your interests</p>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.1rem', color: '#666666' }}>
            Generating your personalized tests...
          </div>
        ) : (
          <div style={gridStyle}>
            {mockTests.map((test) => (
              <div key={test.id} style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h3 style={h3Style}>{test.title}</h3>
                  <span style={badgeStyle}>{test.difficulty}</span>
                </div>
                <div style={testInfoStyle}>
                  <span>📝 {test.questions.length} Questions</span>
                  <span>⏱️ {test.duration}</span>
                </div>
                <div style={previewStyle}>
                  <p style={{ fontSize: '0.9rem', color: '#666666', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Sample question:
                  </p>
                  <div style={previewTextStyle}>
                    {test.questions?.text.substring(0, 100)}...
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => handleStartTest(test)}
                >
                  Start Test
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Courses Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Recommended Courses</h2>
        <div style={gridStyle}>
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="course-card"
              style={{
                ...cardStyle,
                borderLeft: `6px solid ${course.color}`,
                border: selectedCourse === course.id ? `3px solid ${course.color}` : '2px solid #E0E0E0'
              }}
              onClick={() => setSelectedCourse(course.id)}
            >
              <div style={cardHeaderStyle}>
                <h3 style={h3Style}>{course.title}</h3>
                <span style={{
                  ...badgeStyle,
                  background: course.relevance.startsWith('High') ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 152, 0, 0.15)',
                  color: course.relevance.startsWith('High') ? '#2E7D32' : '#E65100',
                  border: course.relevance.startsWith('High') ? '1px solid #4CAF50' : '1px solid #FF9800'
                }}>
                  {course.relevance.split(' - ')}
                </span>
              </div>
              <p style={{ color: '#666666', marginBottom: '1rem', lineHeight: '1.6' }}>
                {course.description}
              </p>
              <div style={testInfoStyle}>
                <span>⏱️ {course.duration}</span>
                <span>📊 {course.level}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {course.skills.map((skill, index) => (
                  <span key={index} style={{
                    padding: '0.375rem 0.875rem',
                    background: '#FFF9E6',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#996B00',
                    fontWeight: '600',
                    border: '1px solid #FFE082'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
              <p style={{ color: '#666666', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                {course.relevance}
              </p>
              <Button variant="primary" fullWidth>
                Start Learning
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div style={actionsStyle}>
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

export default LearningPath
