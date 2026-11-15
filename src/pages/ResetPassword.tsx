import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Atom, ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { firebaseConfigured, getFirebaseAuth } from '../lib/firebase'
import { confirmPasswordReset, updatePassword } from 'firebase/auth'
import OrbScene from '../components/OrbScene'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Firebase puts the verification action code in the 'oobCode' query parameter
  const oobCode = searchParams.get('oobCode')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!firebaseConfigured) {
      setError('Firebase is not configured. Please verify your Firebase environment variables.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setBusy(true)
    try {
      const auth = getFirebaseAuth()
      if (oobCode) {
        // Resetting password via the link emailed by Firebase
        await confirmPasswordReset(auth, oobCode, password)
        setNotice('Your password has been reset successfully. Redirecting to login...')
        setTimeout(() => navigate('/login'), 2500)
      } else if (auth.currentUser) {
        // User is currently signed in and updating password
        await updatePassword(auth.currentUser, password)
        setNotice('Password updated successfully.')
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        throw new Error('Invalid or expired password reset link. Please request a new one.')
      }
    } catch (e: any) {
      if (e?.code === 'auth/expired-action-code') {
        setError('This reset link has expired. Please request a new one.')
      } else if (e?.code === 'auth/invalid-action-code') {
        setError('Invalid reset link. It may have already been used.')
      } else if (e?.code === 'auth/weak-password') {
        setError('Password should be stronger.')
      } else {
        setError(e instanceof Error ? e.message : 'Failed to update password. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Link to="/" className="brand">
          <span className="brand-mark"><Atom size={20} /></span>
          <span>PROM<span>NEXA</span></span>
        </Link>
        <OrbScene />
        <div className="auth-visual-copy">
          <div className="eyebrow">SECURITY & RECOVERY</div>
          <h1>Create a new<br /><span>secure password.</span></h1>
          <p>Regain access to your prompt engineering challenges and learning journey.</p>
          <div className="auth-trust"><ShieldCheck size={16} /> Your account security is protected.</div>
        </div>
        <div className="auth-visual-foot">PROMNEXA / CREATIVE INTELLIGENCE</div>
      </div>

      <div className="auth-panel">
        <Link to="/login" className="back-home"><ArrowLeft size={15} /> Back to sign in</Link>
        <div className="auth-form-wrap">
          <div className="auth-kicker">PASSWORD RESET</div>
          <h2>Set new password.</h2>
          <p className="auth-subtitle">Choose a new password with at least 8 characters.</p>

          <form onSubmit={submit} className="auth-form">
            <label>
              New password
              <div className="input-wrap">
                <LockKeyhole size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <label>
              Confirm password
              <div className="input-wrap">
                <LockKeyhole size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </div>
            </label>

            {error && <div className="alert alert-error">{error}</div>}
            {notice && <div className="alert alert-success">{notice}</div>}

            <button className="button button-primary auth-submit" disabled={busy}>
              {busy ? 'Updating…' : 'Update password'} <ArrowRight size={17} />
            </button>
          </form>

          {!firebaseConfigured && (
            <div className="config-note">Preview mode: authentication becomes active after Firebase setup.</div>
          )}
        </div>
      </div>
    </div>
  )
}