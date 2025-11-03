import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './StatsCard.scss'

function StatsCard({ label, value, color }) {
  const cardRef = useRef()
  const valueRef = useRef()

  useEffect(() => {
    gsap.from(valueRef.current, {
      textContent: 0,
      duration: 2,
      ease: 'power1.out',
      snap: { textContent: 1 },
      onUpdate: function() {
        const val = Math.ceil(this.targets()[0].textContent)
        if (typeof value === 'string' && value.includes('%')) {
          valueRef.current.textContent = val + '%'
        } else if (typeof value === 'string' && value.includes('h')) {
          valueRef.current.textContent = val + 'h'
        }
      }
    })
  }, [value])

  return (
    <div className="stats-card" ref={cardRef} style={{ borderLeftColor: color }}>
      <h3 className="stats-label">{label}</h3>
      <div className="stats-value" ref={valueRef}>{value}</div>
    </div>
  )
}

export default StatsCard
