import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ArrowRight, Atom, Sparkles, Brain, Eye, Wrench, Search, Swords, Trophy, Target, ChevronRight, Zap, ShieldCheck, Image as ImageIcon } from 'lucide-react'
import OrbScene from './components/OrbScene'
import Shell from './components/Shell'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Games from './pages/Games'
import GamePage from './pages/GamePage'
import Learn from './pages/Learn'
import AILab from './pages/AILab'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import { useAuth } from './lib/AuthContext'

function Landing() {
  const { user } = useAuth()

  return (
    <div className="landing" style={{ minHeight: '100vh', background: '#07090e', color: '#fff', overflowX: 'hidden' }}>
      <nav className="landing-nav wrap">
        <Link to="/" className="brand">
          <span className="brand-mark"><Atom size={20}/></span>
          <span>PROM<span>NEXA</span></span>
        </Link>
        <div className="landing-links">
          <a href="#experience">Experience</a>
          <a href="#games">Games</a>
          <a href="#how">How it works</a>
        </div>
        <Link className="button button-small button-outline" to={user ? '/dashboard' : '/auth'}>
          {user ? 'Open dashboard' : 'Sign in'} <ArrowRight size={15}/>
        </Link>
      </nav>

      {/* Hero Section */}
      <section 
        className="hero wrap" 
        style={{ 
          position: 'relative', 
          minHeight: '75vh', 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr', 
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div className="hero-copy" style={{ zIndex: 2 }}>
          <div className="eyebrow"><span className="eyebrow-dot"/> THE PROMPT ENGINEERING PLAYGROUND</div>
          <h1 style={{ fontSize: '3.6rem', lineHeight: '1.1', margin: '20px 0', fontWeight: 800 }}>
            Imagine more.<br/>
            <span style={{ color: '#e11d48' }}>Prompt better.</span>
          </h1>
          <p className="hero-description" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '480px', marginBottom: '30px' }}>
            Turn curiosity into a skill. Create images, rebuild what you see, and learn how tiny words can transform an AI result.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
            <Link to={user ? '/dashboard' : '/auth'} className="button button-primary">
              Enter the experience <ArrowRight size={17}/>
            </Link>
            <a className="button button-ghost" href="#games">
              <span className="play-small">▶</span> Explore the games
            </a>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars"><span>✦</span><span>◈</span><span>✧</span></div>
            <div><b>Learn by doing</b><small>Practice · Feedback · Progress</small></div>
            <div className="proof-divider"/>
            <div><b>6 game modes</b><small>From curious to confident</small></div>
          </div>
        </div>

        {/* Right side 3D hero animation container */}
        <div 
          className="hero-visual" 
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: '520px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <div className="visual-glow"/>
          <OrbScene/>

          <div className="floating-card floating-card-top" style={{ zIndex: 3 }}>
            <span className="float-icon"><Sparkles size={16}/></span>
            <div><b>Prompt evolution</b><small>Small details. Better results.</small></div>
            <span className="pulse-dot"/>
          </div>

          <div className="floating-card floating-card-bottom" style={{ zIndex: 3 }}>
            <div className="mini-score"><span>+24</span><small>XP</small></div>
            <div><b>Skill unlocked</b><small>Visual storyteller</small></div>
            <span className="tiny-check">✓</span>
          </div>
        </div>
      </section>

      <section className="ticker">
        <div className="ticker-track">
          <span>CREATE WITHOUT LIMITS</span><i>✳</i><span>OBSERVE EVERY DETAIL</span><i>✳</i><span>LEARN THROUGH PLAY</span><i>✳</i>
          <span>CREATE WITHOUT LIMITS</span><i>✳</i><span>OBSERVE EVERY DETAIL</span><i>✳</i><span>LEARN THROUGH PLAY</span>
        </div>
      </section>

      <section className="section wrap" id="experience">
        <div className="section-heading">
          <div><div className="eyebrow">A NEW WAY TO LEARN</div><h2>Not another course.<br/><span>A creative playground.</span></h2></div>
          <p>Write a prompt, see what happens, understand what went wrong, and try again. Every round makes your visual thinking sharper.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-large">
            <div className="feature-number">01 / CREATE</div>
            <div className="feature-art feature-art-orb"><Sparkles size={42}/></div>
            <h3>Bring ideas to life</h3>
            <p>Experiment with image prompts, explore styles, and learn how clear descriptions change your results.</p>
            <span className="feature-tag">FREE-STYLE STUDIO</span>
          </article>
          <article className="feature-card">
            <div className="feature-number">02 / OBSERVE</div>
            <div className="feature-art"><Eye size={38}/></div>
            <h3>Notice the details</h3>
            <p>Study a reference, recreate it, and discover the details your eyes almost missed.</p>
            <span className="feature-tag">VISUAL THINKING</span>
          </article>
          <article className="feature-card">
            <div className="feature-number">03 / IMPROVE</div>
            <div className="feature-art"><Target size={38}/></div>
            <h3>Level up your prompts</h3>
            <p>Get useful feedback about clarity, lighting, composition, and missing details.</p>
            <span className="feature-tag">SMART FEEDBACK</span>
          </article>
        </div>
      </section>

      <section className="games-section" id="games">
        <div className="wrap">
          <div className="section-heading">
            <div><div className="eyebrow">CHOOSE YOUR CHALLENGE</div><h2>Six ways to <span>play smarter.</span></h2></div>
            <Link className="text-link" to={user ? '/games' : '/auth'}>Explore all games <ArrowRight size={16}/></Link>
          </div>
          <div className="game-preview-grid">
            {[
              {n:'01',id:'freestyle',title:'FreeStyle Studio',desc:'Create any image from your imagination.',icon:Sparkles,color:'red',tag:'CREATE'},
              {n:'02',id:'rebuild',title:'Rebuild the Image',desc:'Recreate a reference with words.',icon:ImageIcon,color:'orange',tag:'OBSERVE'},
              {n:'03',id:'memory',title:'Memory Vision',desc:'Study for 10 seconds. Recall the details.',icon:Eye,color:'pink',tag:'REMEMBER'},
              {n:'04',id:'detective',title:'Prompt Detective',desc:'Find the clues hidden in an image.',icon:Search,color:'violet',tag:'DETECT'},
              {n:'05',id:'repair',title:'Prompt Repair Lab',desc:'Repair weak prompts and see the difference.',icon:Wrench,color:'gold',tag:'IMPROVE'},
              {n:'06',id:'battle',title:'Prompt Battle',desc:'Put your prompt skills to the test.',icon:Swords,color:'red',tag:'COMPETE'}
            ].map(g => (
              <Link 
                to={user ? `/games/${g.id}` : '/auth'} 
                className="game-preview" 
                key={g.n}
              >
                <div className={`game-icon ${g.color}`}><g.icon size={23}/></div>
                <div className="game-meta"><span>{g.n} / {g.tag}</span><span className="game-arrow"><ArrowRight size={16}/></span></div>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
                <div className="game-bottom"><span>ENTER CHALLENGE</span><ChevronRight size={15}/></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section wrap" id="how">
        <div className="how-visual">
          <div className="how-ring ring-one"/><div className="how-ring ring-two"/>
          <div className="how-core"><Atom size={54}/></div>
          <div className="how-chip chip-a">01 · Imagine</div>
          <div className="how-chip chip-b">02 · Generate</div>
          <div className="how-chip chip-c">03 · Improve</div>
        </div>
        <div className="how-copy">
          <div className="eyebrow">YOUR JOURNEY STARTS HERE</div>
          <h2>Every attempt<br/>teaches <span>something.</span></h2>
          <p>There is no magic prompt. There is observation, experimentation, and improvement. PROMNEXA helps you build those skills one challenge at a time.</p>
          <div className="journey-list">
            <div><span>01</span><p><b>Try an idea</b><small>Start with your own words.</small></p><ChevronRight size={17}/></div>
            <div><span>02</span><p><b>Understand the result</b><small>See what worked and what was missing.</small></p><ChevronRight size={17}/></div>
            <div><span>03</span><p><b>Improve and grow</b><small>Earn XP as your skills develop.</small></p><ChevronRight size={17}/></div>
          </div>
          <Link className="button button-primary" to={user ? '/dashboard' : '/auth'}>Start your journey <ArrowRight size={17}/></Link>
        </div>
      </section>

      <footer className="landing-footer wrap">
        <Link to="/" className="brand"><span className="brand-mark"><Atom size={18}/></span><span>PROM<span>NEXA</span></span></Link>
        <p>Made for curious minds. Built for better prompts.</p>
        <span>© 2026 PROMNEXA</span>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/dashboard" element={<ProtectedRoute><Shell><Dashboard/></Shell></ProtectedRoute>}/>
      <Route path="/games" element={<ProtectedRoute><Shell><Games/></Shell></ProtectedRoute>}/>
      <Route path="/games/:gameId" element={<ProtectedRoute><Shell><GamePage/></Shell></ProtectedRoute>}/>
      <Route path="/learn" element={<ProtectedRoute><Shell><Learn/></Shell></ProtectedRoute>}/>
      <Route path="/ai-lab" element={<ProtectedRoute><Shell><AILab/></Shell></ProtectedRoute>}/>
      <Route path="/leaderboard" element={<ProtectedRoute><Shell><Leaderboard/></Shell></ProtectedRoute>}/>
      <Route path="/profile" element={<ProtectedRoute><Shell><Profile/></Shell></ProtectedRoute>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}