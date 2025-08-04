import { useState, useCallback } from 'react'

const useRateLimit = () => {
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [retryAfter, setRetryAfter] = useState(60)

  const handleRateLimit = useCallback((response) => {
    if (response.status === 429) {      const retryAfterHeader = response.headers.get('retry-after')
      const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader) : 60
      
      setRetryAfter(retryAfterSeconds)
      setIsRateLimited(true)
      return true
    }
    return false
  }, [])

  const closeRateLimit = useCallback(() => {
    setIsRateLimited(false)
  }, [])

  return {
    isRateLimited,
    retryAfter,
    handleRateLimit,
    closeRateLimit
  }
}

export default useRateLimit 