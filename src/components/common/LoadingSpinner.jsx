import { Loader2 } from 'lucide-react'
import './LoadingSpinner.css'

export default function LoadingSpinner({
  message = 'Loading...',
  size = 'md', // 'sm' | 'md' | 'lg'
  fullHeight = false,
  className = '',
}) {
  const sizeMap = {
    sm: 18,
    md: 26,
    lg: 38,
  }

  return (
    <div
      className={`loading-container loading-${size} ${fullHeight ? 'loading-full-height' : ''} ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2
        size={sizeMap[size] || 26}
        className="loading-spinner-icon"
      />
      {message && <p className="loading-message">{message}</p>}
      <span className="sr-only">{message}</span>
    </div>
  )
}
