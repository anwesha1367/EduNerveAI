import pythonBridge from '../utils/pythonBridge.js'

export const generateReport = async (req, res) => {
  try {
    const reportData = req.body

    // Generate report using Python service
    const result = await pythonBridge.generateReport(reportData)

    res.json({
      success: true,
      filename: result.filename,
      downloadUrl: `http://localhost:5001${result.download_url}`
    })
  } catch (error) {
    console.error('Error generating report:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate report'
    })
  }
}

export const getReport = (req, res) => {
  const { reportId } = req.params

  res.json({
    success: true,
    report: {
      id: reportId,
      overallScore: 82,
      summary: 'Great performance overall!'
    }
  })
}
