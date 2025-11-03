import './ReportCard.css'

function ReportCard({ title, children }) {
  return (
    <div className="report-card">
      <h2 className="report-card-title">{title}</h2>
      <div className="report-card-content">
        {children}
      </div>
    </div>
  )
}

export default ReportCard
