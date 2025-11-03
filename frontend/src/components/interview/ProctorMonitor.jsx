import './ProctorMonitor.scss'

function ProctorMonitor({ proctoring }) {
  return (
    <div className="proctor-monitor">
      <h3>Proctoring Status</h3>
      <div className="proctor-items">
        <div className="proctor-item">
          <span className={`indicator ${proctoring.faceDetected ? 'good' : 'bad'}`} />
          <span>Face Detection</span>
        </div>
        <div className="proctor-item">
          <span className={`indicator ${proctoring.tabChanges === 0 ? 'good' : 'warning'}`} />
          <span>Tab Changes: {proctoring.tabChanges}</span>
        </div>
        <div className="proctor-item">
          <span className={`indicator ${proctoring.copyPasteAttempts === 0 ? 'good' : 'warning'}`} />
          <span>Copy/Paste: {proctoring.copyPasteAttempts}</span>
        </div>
      </div>
    </div>
  )
}

export default ProctorMonitor
