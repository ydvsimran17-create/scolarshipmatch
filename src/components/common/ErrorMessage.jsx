import { AlertCircle, RotateCcw } from 'lucide-react'
import './ErrorMessage.css'

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the service.',
  onRetry = null,
  retryLabel = 'Try Again',
  className = '',
}) {
  return (
    <div className={`error-state-card card ${className}`} role="alert">
      <div className="error-icon-wrapper">
        <AlertCircle size={24} className="error-icon" />
      </div>

      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-message">{message}</p>

        {onRetry && (
          <button
            type="button"
            className="btn btn-outline btn-sm error-retry-btn"
            onClick={onRetry}
          >
            <RotateCcw size={14} /> {retryLabel}
          </button>
        )}
      </div>
    </div>
  )
}
