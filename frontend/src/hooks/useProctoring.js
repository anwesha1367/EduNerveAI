import { useEffect } from 'react'
import { useInterview } from './useInterview'

export function useProctoring() {
  const { updateProctoring } = useInterview()

  useEffect(() => {
    // Tab change detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateProctoring({ tabChanges: (prev) => prev + 1 })
      }
    }

    // Copy-paste detection
    const handleCopy = (e) => {
      updateProctoring({ copyPasteAttempts: (prev) => prev + 1 })
    }

    const handlePaste = (e) => {
      updateProctoring({ copyPasteAttempts: (prev) => prev + 1 })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
    }
  }, [updateProctoring])

  return null
}
