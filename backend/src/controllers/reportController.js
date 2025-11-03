export const generateReport = (req, res) => {
  const { interviewId } = req.body

  const report = {
    id: Date.now().toString(),
    interviewId,
    generatedAt: new Date(),
    // Report data here
  }

  res.json({
    success: true,
    report
  })
}

export const getReport = (req, res) => {
  const { reportId } = req.params

  res.json({
    success: true,
    report: {
      id: reportId,
      // Report data
    }
  })
}
