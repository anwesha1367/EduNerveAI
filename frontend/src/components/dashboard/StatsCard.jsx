import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './StatsCard.css'

function StatsCard({ label, value, color }) {
  const valueRef = useRef()

  useEffect(() => {
    if (typeof value === 'number' && valueRef.current) {
      gsap.from(valueRef.current, {
        textContent: 0,
        duration: 2,
        ease: 'power1.out',
        snap: { textContent: 1 }
      })
    }
  }, [value])

  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-label">{label}</div>
      <div className="stats-value" ref={valueRef}>{value}</div>
    </div>
  )
}

export default StatsCard
