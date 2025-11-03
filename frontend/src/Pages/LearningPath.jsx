import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../components/common/Button'
import '../styles/learning-path.scss'

gsap.registerPlugin(ScrollTrigger)

function LearningPath() {
  const { user } = useAuth()
  const { reportData } = useInterview()
  const navigate = useNavigate()
  const pathRef = useRef()
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const cards = pathRef.current.querySelectorAll('.course-card')
    
    cards.forEach((card, index) => {
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

  const courses = [
    {
      id: 1,
      title: 'Advanced Data Structures',
      description: 'Master complex data structures based on your interview performance',
      duration: '6 weeks',
      level: 'Intermediate',
      skills: ['Trees', 'Graphs', 'Hash Tables'],
      relevance: 'High - based on your interview gaps'
    },
    {
      id: 2,
      title: 'System Design Fundamentals',
      description: 'Learn to design scalable systems',
      duration: '8 weeks',
      level: 'Advanced',
      skills: ['Architecture', 'Scalability', 'Databases'],
      relevance: 'Medium - recommended for growth'
    },
    {
      id: 3,
      title: 'Communication Skills for Tech',
      description: 'Improve your technical communication',
      duration: '4 weeks',
      level: 'All Levels',
      skills: ['Presentation', 'Clarity', 'Confidence'],
      relevance: 'High - improve interview performance'
    }
  ]

  return (
    <div className="learning-path-page" ref={pathRef}>
      <div className="path-header">
        <h1>Personalized Learning Path</h1>
        <p>Hey {user?.name}! Based on your interview performance, here's your recommended journey</p>
      </div>

      <div className="recommendation-banner">
        <div className="banner-icon">🎯</div>
        <div className="banner-content">
          <h2>Your Focus Areas</h2>
          <p>Based on your recent interview, we recommend focusing on: <strong>Data Structures</strong>, <strong>Problem Solving</strong>, and <strong>Communication</strong></p>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className={`course-card ${selectedCourse === course.id ? 'selected' : ''}`}
            onClick={() => setSelectedCourse(course.id)}
          >
            <div className="course-header">
              <h3>{course.title}</h3>
              <span className={`relevance-badge ${course.relevance.split(' - ')[0].toLowerCase()}`}>
                {course.relevance.split(' - ')[0]}
              </span>
            </div>
            <p className="course-description">{course.description}</p>
            <div className="course-meta">
              <span>⏱️ {course.duration}</span>
              <span>📊 {course.level}</span>
            </div>
            <div className="course-skills">
              {course.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
            <p className="course-relevance">{course.relevance}</p>
            <Button variant="primary" fullWidth>
              Start Learning
            </Button>
          </div>
        ))}
      </div>

      <div className="path-actions">
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
