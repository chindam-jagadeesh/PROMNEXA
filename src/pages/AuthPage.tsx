import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Atom, ArrowLeft, ArrowRight, Eye, EyeOff, Mail, LockKeyhole, UserRound, ShieldCheck } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { firebaseConfigured, getFirebaseAuth } from '../lib/firebase'
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import OrbScene from '../components/OrbScene'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  
  // 1. Pulled 'user' from useAuth
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard'

  // 2. NEW FIX: Automatically redirect to dashboard if the user is already logged in (e.g. returning from Google Redirect)
  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true })
    }
  }, [user, navigate, destination])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!firebaseConfigured) {
      setError('Firebase is not configured. Please verify your keys in .env.')
      return
    }

    setBusy(true)
    try {
      const auth = getFirebaseAuth()
      if (mode === 'register') {
        await signUpWithEmail(email, password)
        if (auth.currentUser && name) {
          await updateProfile(auth.currentUser, { displayName: name })
        }
        navigate('/dashboard')
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email)
        setNotice('If an account exists for that email, a password-reset link has been sent.')
      } else {
        await signInWithEmail(email, password)
        navigate(destination)
      }
    } catch (e: any) {
      if (e?.code === 'auth/user-not-found' || e?.code === 'auth/wrong-password' || e?.code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else if (e?.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (e?.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.')
      } else {
        setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    setError('')
    setNotice('')

    if (!firebaseConfigured) {
      setError('Firebase is not configured. Please check your .env file.')
      return
    }

    try {
      await signInWithGoogle()
    } catch (e: any) {
      if (e?.code !== 'auth/popup-closed-by-user') {
        setError(e instanceof Error ? e.message : 'Google sign-in failed.')
      }
    }
  }

  return (
    <div className="auth-page">
      {/* Visual Container with edge-to-edge canvas pinning */}
      <div 
        className="auth-visual" 
        style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          width: '100%', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Full-bleed background 3D canvas */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 0, 
            pointerEvents: 'none' 
          }}
        >
          <OrbScene />
        </div>

        <Link to="/" className="brand" style={{ position: 'relative', zIndex: 2 }}>
          <span className="brand-mark"><Atom size={20} /></span>
          <span>PROM<span>NEXA</span></span>
        </Link>
        
        <div className="auth-visual-copy" style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow">YOUR CREATIVE MIND, UNLOCKED</div>
          <h1>Great prompts<br />start with <span>curiosity.</span></h1>
          <p>Build your eye. Train your imagination. Learn by creating.</p>
          <div className="auth-trust"><ShieldCheck size={16} /> Your progress belongs to you.</div>
        </div>

        <div className="auth-visual-foot" style={{ position: 'relative', zIndex: 2 }}>
          PROMNEXA / CREATIVE INTELLIGENCE
        </div>
      </div>

      <div className="auth-panel">
        <Link to="/" className="back-home"><ArrowLeft size={15} /> Back to home</Link>
        <div className="auth-form-wrap">
          <div className="auth-kicker">
            {mode === 'register' ? 'CREATE YOUR ACCOUNT' : mode === 'forgot' ? 'ACCOUNT RECOVERY' : 'WELCOME BACK'}
          </div>
          <h2>
            {mode === 'register' ? 'Start exploring.' : mode === 'forgot' ? 'Reset your password.' : 'Enter your world.'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'register'
              ? 'Create an account and start your prompt journey.'
              : mode === 'forgot'
              ? 'We’ll email you a secure password-reset link.'
              : 'Sign in to continue where your imagination left off.'}
          </p>

          {mode !== 'forgot' && (
            <button className="google-button" onClick={google}>
              <span className="google-g">G</span> Continue with Google <ArrowRight size={15} />
            </button>
          )}

          {mode !== 'forgot' && (
            <div className="auth-divider">
              <span />or continue with email<span />
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            {mode === 'register' && (
              <label>
                Full name
                <div className="input-wrap">
                  <UserRound size={17} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

            <label>
              Email address
              <div className="input-wrap">
                <Mail size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            {mode !== 'forgot' && (
              <label>
                Password
                <div className="input-wrap">
                  <LockKeyhole size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
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
            )}

            {mode === 'login' && (
              <button
                type="button"
                className="forgot-link"
                onClick={() => {
                  setMode('forgot')
                  setError('')
                  setNotice('')
                }}
              >
                Forgot password?
              </button>
            )}

            {error && <div className="alert alert-error">{error}</div>}
            {notice && <div className="alert alert-success">{notice}</div>}

            <button className="button button-primary auth-submit" disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'register'
                ? 'Create account'
                : mode === 'forgot'
                ? 'Send reset link'
                : 'Sign in'}{' '}
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'register'
              ? 'Already have an account?'
              : mode === 'forgot'
              ? 'Remember your password?'
              : 'New to PROMNEXA?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register')
                setError('')
                setNotice('')
              }}
            >
              {mode === 'register' || mode === 'forgot' ? 'Sign in' : 'Create an account'}
            </button>
          </div>

          {!firebaseConfigured && (
            <div className="config-note">Preview mode: authentication becomes active after Firebase setup.</div>
          )}

          <small className="auth-legal">By continuing, you agree to use PROMNEXA responsibly.</small>
        </div>
      </div>
    </div>
  )
}