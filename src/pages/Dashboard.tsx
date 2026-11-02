import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, Flame, Trophy, Target, Sparkles, Clock3, 
  ChevronRight, Zap, Eye, Image as ImageIcon, Swords, Search, Wrench, Atom 
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getUserStats, UserStats } from '../lib/gameService'

const games = [
  { id: 'freestyle', name: 'FreeStyle Studio', desc: 'Turn your idea into an image.', icon: Sparkles, tone: 'red', time: '5–10 min' },
  { id: 'rebuild', name: 'Rebuild the Image', desc: 'Describe every detail you can see.', icon: ImageIcon, tone: 'orange', time: '5 min' },
  { id: 'memory', name: 'Memory Vision', desc: 'Observe for 10 seconds. Recall it.', icon: Eye, tone: 'pink', time: '3 min' },
  { id: 'detective', name: 'Prompt Detective', desc: 'Solve the clues behind an image.', icon: Search, tone: 'violet', time: '4 min' },
  { id: 'repair', name: 'Prompt Repair Lab', desc: 'Make a weak prompt stronger.', icon: Wrench, tone: 'gold', time: '5 min' },
  { id: 'battle', name: 'Prompt Battle', desc: 'Test your skills against a challenge.', icon: Swords, tone: 'red', time: '6 min' }
]

function getRankTitle(level: number): string {
  if (level >= 10) return 'Grandmaster'
  if (level >= 7) return 'Prompt Architect'
  if (level >= 5) return 'Visionary'
  if (level >= 3) return 'Crafter'
  if (level >= 2) return 'Apprentice'
  return 'Explorer'
}

// 3D Holographic Brain & Particle Orbits Canvas Animation Component (Crimson & Black Theme)
function Hero3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || 450)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 350)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener('resize', handleResize)

    const brainNodes: { x: number; y: number; z: number; radius: number; pulseOffset: number }[] = []
    for (let i = 0; i < 42; i++) {
      const u = Math.random() * Math.PI * 2
      const v = Math.random() * Math.PI - Math.PI / 2
      const r = 45 + Math.random() * 35
      
      const bx = Math.cos(v) * Math.cos(u) * r * 1.2
      const by = Math.sin(v) * r * 0.85
      const bz = Math.cos(v) * Math.sin(u) * r

      brainNodes.push({
        x: bx,
        y: by,
        z: bz,
        radius: Math.random() * 2 + 1.2,
        pulseOffset: Math.random() * Math.PI * 2
      })
    }

    let time = 0

    const render = () => {
      time += 0.015
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      // Cinematic Radial Crimson Background Bloom
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180)
      bgGrad.addColorStop(0, 'rgba(225, 29, 72, 0.35)') 
      bgGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.15)')
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Rotating Orbital Data Rings
      const ringAngles = [time * 0.5, -time * 0.4, time * 0.8]
      const ringRadii = [95, 120, 145]
      ringRadii.forEach((rad, idx) => {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(ringAngles[idx])
        ctx.beginPath()
        ctx.ellipse(0, 0, rad, rad * 0.38, 0, 0, Math.PI * 2)
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(225, 29, 72, 0.45)' : 'rgba(245, 158, 11, 0.35)' 
        ctx.lineWidth = 1.2
        ctx.stroke()
        ctx.restore()
      })

      const rotY = time * 0.6
      const rotX = Math.sin(time * 0.3) * 0.25

      const projectedNodes = brainNodes.map(node => {
        let x1 = node.x * Math.cos(rotY) + node.z * Math.sin(rotY)
        let y1 = node.y
        let z1 = -node.x * Math.sin(rotY) + node.z * Math.cos(rotY)
        let x2 = x1
        let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX)
        let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX)

        const fov = 350
        const scale = fov / (fov + z2 + 100)

        return {
          x: cx + x2 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
          pulseOffset: node.pulseOffset,
          radius: node.radius
        }
      })

      projectedNodes.sort((a, b) => a.z - b.z)

      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const dx = projectedNodes[i].x - projectedNodes[j].x
          const dy = projectedNodes[i].y - projectedNodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 48) {
            const alpha = (1 - dist / 48) * 0.35
            ctx.strokeStyle = `rgba(225, 29, 72, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(projectedNodes[i].x, projectedNodes[i].y)
            ctx.lineTo(projectedNodes[j].x, projectedNodes[j].y)
            ctx.stroke()
          }
        }
      }

      projectedNodes.forEach(node => {
        const pulse = (Math.sin(time * 3 + node.pulseOffset) + 1) * 0.5
        const currentRadius = node.radius * node.scale * (1 + pulse * 0.5)

        ctx.fillStyle = pulse > 0.6 ? '#ffffff' : '#fb7185'
        ctx.shadowColor = '#e11d48'
        ctx.shadowBlur = pulse > 0.6 ? 8 : 2
        ctx.beginPath()
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      for (let i = 0; i < 15; i++) {
        const pAngle = time * 0.7 + (i * Math.PI * 2) / 15
        const pDist = 110 + Math.sin(i * 2 + time * 2) * 20
        const px = cx + Math.cos(pAngle) * pDist
        const py = cy + Math.sin(pAngle) * (pDist * 0.5)

        ctx.fillStyle = i % 2 === 0 ? 'rgba(225, 29, 72, 0.8)' : 'rgba(245, 158, 11, 0.8)'
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0, opacity: 0.8 }}
    />
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats & { streak?: number }>({
    xp: 0,
    level: 1,
    totalAttempts: 0,
    gamesPlayed: {},
    streak: 0
  })
  const [loading, setLoading] = useState(true)

  const name = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer'

  useEffect(() => {
    async function fetchStats() {
      if (user?.uid) {
        try {
          const userStats = await getUserStats(user.uid)
          setStats(userStats)
        } catch (err) {
          console.warn('Failed to load dashboard stats:', err)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchStats()
  }, [user])

  const rankTitle = getRankTitle(stats.level)
  
  // FIXED: Pull streak directly from database stats (defaults to 0 if not present)
  const streak = stats.streak !== undefined ? stats.streak : (stats.totalAttempts > 0 ? 1 : 0)

  const getThemeColor = (tone: string) => {
    const map: Record<string, { bg: string, text: string, border: string }> = {
      red: { bg: 'rgba(225, 29, 72, 0.15)', text: '#fb7185', border: 'rgba(225, 29, 72, 0.3)' },
      orange: { bg: 'rgba(249, 115, 22, 0.15)', text: '#fdba74', border: 'rgba(249, 115, 22, 0.3)' },
      pink: { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
      violet: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)' },
      gold: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' },
    }
    return map[tone] || map.red
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', color: '#fff' }}>
      
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            YOUR CREATIVE SPACE
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Welcome back, <span style={{ color: '#e11d48' }}>{name}.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>
            Your next great prompt is one experiment away.
          </p>
        </div>
        <Link 
          to="/games" 
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', textDecoration: 'none', 
            padding: '12px 24px', borderRadius: '12px', fontWeight: 700, 
            fontSize: '14px', border: '1px solid rgba(225, 29, 72, 0.4)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)'
          }}
        >
          Play a challenge <ArrowRight size={16} />
        </Link>
      </div>

      {/* Hero Section */}
      <section style={{ 
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
        background: 'rgba(15, 23, 42, 0.7)', 
        border: '1px solid rgba(225, 29, 72, 0.3)', 
        borderRadius: '24px', 
        overflow: 'hidden', marginBottom: '32px', minHeight: '340px',
        backdropFilter: 'blur(12px)'
      }}>
        
        {/* Hero Copy (Left) */}
        <div style={{ flex: '1 1 400px', padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '16px', width: 'fit-content', border: '1px solid rgba(225,29,72,0.3)' }}>
            <Sparkles size={13} /> YOUR DAILY SPARK
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.15, color: '#fff' }}>
            See beyond<br />the obvious.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '380px' }}>
            Train your observation skills with a quick visual challenge. Every detail you notice helps you write a better prompt.
          </p>
          <Link 
            to="/games/memory" 
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', textDecoration: 'none', 
              padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', width: 'fit-content',
              border: '1px solid rgba(225, 29, 72, 0.4)',
              backdropFilter: 'blur(8px)'
            }}
          >
            Try Memory Vision <ArrowRight size={16} />
          </Link>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock3 size={14} /> 10-second observation</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={14} /> Beginner friendly</span>
          </div>
        </div>

        {/* 3D Holographic Brain (Right) */}
        <div style={{ flex: '1 1 350px', position: 'relative', minHeight: '300px', borderLeft: '1px solid rgba(225, 29, 72, 0.15)', background: 'radial-gradient(circle at center, rgba(225, 29, 72, 0.08) 0%, transparent 70%)' }}>
          <Hero3DCanvas />
          <div style={{ position: 'absolute', top: '15%', right: '15%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, color: '#fb7185', backdropFilter: 'blur(4px)', zIndex: 3 }}>
            OBSERVE <span>✦</span>
          </div>
          <div style={{ position: 'absolute', bottom: '25%', left: '15%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, color: '#fb7185', backdropFilter: 'blur(4px)', zIndex: 3 }}>
            IMAGINE <span>↗</span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '45px' }}>
        
        {/* Total XP */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fcd34d' }}>
            <Zap size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Total XP</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              {loading ? '...' : stats.xp} <span style={{ fontSize: '14px', color: '#fcd34d' }}>XP</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{stats.xp > 0 ? 'Consistent progress' : 'Your journey starts here'}</div>
          </div>
        </div>

        {/* Day Streak */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
            <Flame size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Day Streak</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              {loading ? '...' : streak} <span style={{ fontSize: '14px', color: '#f97316' }}>{streak === 1 ? 'day' : 'days'}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{streak > 0 ? 'Daily momentum active' : 'Build a daily habit'}</div>
          </div>
        </div>

        {/* Challenges */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
            <Trophy size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Challenges</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              {loading ? '...' : stats.totalAttempts} <span style={{ fontSize: '14px', color: '#e11d48' }}>completed</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{stats.totalAttempts > 0 ? 'Arena challenges logged' : 'Ready when you are'}</div>
          </div>
        </div>

        {/* Skill Level */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
            <Target size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Skill Level</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              0{stats.level}
            </div>
            <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: 600, marginTop: '6px' }}>{rankTitle}</div>
          </div>
        </div>

      </div>

      {/* Arena Grid Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>PICK YOUR NEXT MOVE</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Enter the game arena</h2>
        </div>
        <Link to="/games" style={{ color: '#e11d48', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          View all games <ArrowRight size={14} />
        </Link>
      </div>

      {/* Game Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '45px' }}>
        {games.map((g, i) => {
          const theme = getThemeColor(g.tone)
          return (
            <Link 
              key={g.id} 
              to={`/games/${g.id}`} 
              style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '16px', 
                padding: '24px', 
                textDecoration: 'none', 
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = theme.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.bg, color: theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <g.icon size={22} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'rgba(255,255,255,0.1)' }}>0{i + 1}</span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>{g.name}</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, flex: 1 }}>{g.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  <Clock3 size={14} /> {g.time}
                </span>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }}>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom Academy Banner */}
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.7)', 
        border: '1px solid rgba(225, 29, 72, 0.3)', 
        borderRadius: '16px', 
        padding: '24px 32px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e11d48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)' }}>
            <Atom size={24} />
          </div>
          <div>
            <b style={{ display: 'block', fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: '#fff' }}>Your skill tree is waiting.</b>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Complete academy checkpoints to build your foundational knowledge.</p>
          </div>
        </div>
        <Link 
          to="/learn" 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            color: '#fff', background: 'rgba(255, 255, 255, 0.05)', 
            padding: '12px 20px', borderRadius: '10px', fontSize: '13px', 
            fontWeight: 700, textDecoration: 'none', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          Explore learning path <ChevronRight size={16} />
        </Link>
      </div>

    </div>
  )
}