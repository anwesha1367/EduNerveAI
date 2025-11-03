import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './SkillsChart.scss'

function SkillsChart({ data }) {
  const chartRef = useRef()

  useEffect(() => {
    const bars = chartRef.current.querySelectorAll('.skill-bar-fill')
    bars.forEach((bar, index) => {
      gsap.from(bar, {
        width: 0,
        duration: 1.5,
        delay: index * 0.1,
        ease: 'power3.out'
      })
    })
  }, [data])

  return (
    <div className="skills-chart" ref={chartRef}>
      {data.map((skill, index) => (
        <div key={index} className="skill-row">
          <div className="skill-info">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-score">{skill.score}%</span>
          </div>
          <div className="skill-bar">
            <div 
              className="skill-bar-fill" 
              style={{ width: `${skill.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkillsChart
