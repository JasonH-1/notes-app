import { useState, useEffect } from 'react'

const RateLimitModal = ({ isOpen, onClose, retryAfter = 60 }) => {
  const [countdown, setCountdown] = useState(retryAfter)

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      onClose()
    }
  }, [isOpen, countdown, onClose])

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h3 className="font-bold text-lg text-error mb-2">Rate Limit Exceeded</h3>
          <p className="text-base-content/70 mb-4">
            You've made too many requests. Please wait before trying again.
          </p>
          
          <div className="mb-6">
            <div className="text-2xl font-bold text-primary mb-2">
              {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-base-content/50">Time remaining</div>
          </div>

          <div className="w-full bg-base-200 rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((retryAfter - countdown) / retryAfter) * 100}%` }}
            ></div>
          </div>

          <button 
            onClick={onClose} 
            className="btn btn-outline btn-sm"
            disabled={countdown > 0}
          >
            {countdown > 0 ? 'Please wait...' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RateLimitModal 