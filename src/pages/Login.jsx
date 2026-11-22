import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, AlertCircle } from 'lucide-react'
import authService from '../services/authService'
import './Login.css'

const EMPTY_FORM = { email: '', password: '' }

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isRegister = mode === 'register'

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const switchMode = (next) => {
    setMode(next)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isRegister && form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (isRegister) {
        await authService.register({ email: form.email, password: form.password })
      } else {
        await authService.login({ email: form.email, password: form.password })
      }
      navigate('/find-scholarships')
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <GraduationCap size={26} />
          <span className="auth-brand-name">Scholarship Match</span>
        </div>

        <h1 className="auth-title">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-subtitle">
          {isRegister
            ? 'Sign up to get scholarships matched to your profile.'
            : 'Log in to see scholarships matched to you.'}
        </p>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange('email')}
            autoComplete="email"
            required
          />

          <label className="auth-label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            className="input-field"
            placeholder={isRegister ? 'At least 8 characters' : 'Your password'}
            value={form.password}
            onChange={handleChange('password')}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
          />

          {error && (
            <div className="auth-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}
