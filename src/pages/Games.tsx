import { Link } from 'react-router-dom'
import { ArrowRight, Eye, Image as ImageIcon, Search, Sparkles, Swords, Wrench } from 'lucide-react'

const games = [
  { id: 'freestyle', n: '01', title: 'FreeStyle AI Studio', desc: 'Generate images from any idea. Experiment with style, lighting, framing, and detail.', icon: Sparkles, tone: 'red', level: 'ALL LEVELS', kind: 'CREATE' },
  { id: 'rebuild', n: '02', title: 'Rebuild the Image', desc: 'Study a target image, write a prompt, then compare your generated result with the reference.', icon: ImageIcon, tone: 'orange', level: 'BEGINNER → EXPERT', kind: 'OBSERVE' },
  { id: 'memory', n: '03', title: 'Memory Vision', desc: 'Observe an image for 10 seconds. Then rebuild it from memory and find what you missed.', icon: Eye, tone: 'pink', level: 'BEGINNER → EXPERT', kind: 'REMEMBER' },
  { id: 'detective', n: '04', title: 'Prompt Detective', desc: 'Read the visual clues and identify the prompt details that best explain the image.', icon: Search, tone: 'violet', level: 'BEGINNER → EXPERT', kind: 'DETECT' },
  { id: 'repair', n: '05', title: 'Prompt Repair Lab', desc: 'Turn vague prompts into detailed instructions while keeping the original idea intact.', icon: Wrench, tone: 'gold', level: 'ALL LEVELS', kind: 'IMPROVE' },
  { id: 'battle', n: '06', title: 'Prompt Battle', desc: 'Take on a shared benchmark, submit your best prompt, and aim for a higher score.', icon: Swords, tone: 'red', level: 'INTERMEDIATE+', kind: 'COMPETE' }
]

export default function Games() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', color: '#fff' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '45px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            THE ARENA
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Choose your <span style={{ color: '#e11d48' }}>challenge.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0, maxWidth: '520px', lineHeight: 1.6 }}>
            Six game modes. One skill at a time. Your progress begins with the first attempt.
          </p>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.4)', padding: '10px 18px', borderRadius: '14px', fontSize: '12px', fontWeight: 700, color: '#fb7185', backdropFilter: 'blur(8px)', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)' }}>
          <Sparkles size={16} /> <span>6 GAME MODES</span>
        </div>
      </div>

      {/* Game Catalog Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {games.map((g) => {
          const IconComponent = g.icon
          return (
            <Link 
              to={`/games/${g.id}`} 
              key={g.id}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '28px',
                textDecoration: 'none',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.5)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(225, 29, 72, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Background ambient glowing watermark icon */}
              <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.03, pointerEvents: 'none', transform: 'scale(2.5)', color: '#e11d48' }}>
                <IconComponent size={100} />
              </div>

              <div>
                {/* Top Meta row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(225, 29, 72, 0.3)' }}>
                      <IconComponent size={20} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                      {g.n} / {g.kind}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {g.level}
                  </span>
                </div>

                {/* Title & Desc */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: '#fff', letterSpacing: '-0.01em' }}>
                  {g.title}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                  {g.desc}
                </p>
              </div>

              {/* Action CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontSize: '13px', fontWeight: 700, paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                Open challenge <ArrowRight size={15} />
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}