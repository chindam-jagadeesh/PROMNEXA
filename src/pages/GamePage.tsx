import { evaluatePromptWithGroq } from '../lib/groqEvaluator';
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeft, ArrowRight, Eye, Image as ImageIcon, Search, 
  Sparkles, Swords, Wrench, Timer, WandSparkles, Lightbulb, 
  ShieldAlert, Target, Download 
} from 'lucide-react'
import { firebaseConfigured } from '../lib/firebase'
import { useAuth } from '../lib/AuthContext'
import { updateUserStats } from '../lib/gameService'

const data: Record<string, { title: string; tag: string; description: string; icon: any; instructions: string[] }> = {
  freestyle: {
    title: 'FreeStyle AI Studio',
    tag: 'CREATE / 01',
    description: 'Start with an idea. Describe it clearly. Learn how each detail shapes your result.',
    icon: Sparkles,
    instructions: ['Describe the main subject.', 'Add environment, lighting, camera angle, and style.', 'Generate an image from your prompt.']
  },
  rebuild: {
    title: 'Rebuild the Image',
    tag: 'OBSERVE / 02',
    description: 'Look carefully at the reference, describe what you see, and compare your result.',
    icon: ImageIcon,
    instructions: ['Choose your difficulty level (Easy, Medium, Hard).', 'Study the reference image loaded for that level.', 'Describe the details and generate your attempt.']
  },
  memory: {
    title: 'Memory Vision',
    tag: 'REMEMBER / 03',
    description: 'Train your visual memory: observe for 10 seconds, then describe the scene without looking.',
    icon: Eye,
    instructions: ['Select your level and start the 10-second viewing period.', 'When the image disappears, write the prompt from memory.', 'Review AI feedback on your description.']
  },
  detective: {
    title: 'Prompt Detective',
    tag: 'DETECT / 04',
    description: 'Investigate visual clues and learn to connect image details with precise language.',
    icon: Search,
    instructions: ['Study the clue image.', 'Write the prompt details you believe created it.', 'Review feedback and try a more specific prompt.']
  },
  repair: {
    title: 'Prompt Repair Lab',
    tag: 'IMPROVE / 05',
    description: 'Repair a vague prompt while preserving the original idea.',
    icon: Wrench,
    instructions: ['Read the starter prompt.', 'Add specific details without changing the core idea.', 'Review AI feedback and try a stronger version.']
  },
  battle: {
    title: 'Prompt Battle',
    tag: 'COMPETE / 06',
    description: 'Practice against a challenge benchmark. Multiplayer matchmaking can be added after the core game is tested.',
    icon: Swords,
    instructions: ['Review the shared challenge.', 'Write the clearest prompt you can.', 'Improve your prompt using the AI feedback.']
  }
}

export default function GamePage() {
  const { gameId = 'freestyle' } = useParams()
  const game = data[gameId] || data.freestyle
  const { user } = useAuth()

  const [prompt, setPrompt] = useState('')
  const [timer, setTimer] = useState(10)
  const [memoryStarted, setMemoryStarted] = useState(false)
  const [memoryHidden, setMemoryHidden] = useState(false)
  const [busy, setBusy] = useState(false)
  const [busyAction, setBusyAction] = useState<'evaluate' | 'generate' | ''>('')
  const [result, setResult] = useState('')
  const [feedback, setFeedback] = useState<string[]>([])
  const [improvedPrompt, setImprovedPrompt] = useState('')
  const [error, setError] = useState('')

  // Game Levels State (Shared between Rebuild & Memory Vision)
  const [currentLevel, setCurrentLevel] = useState<'easy' | 'medium' | 'hard'>('easy')

  // Real Generated Image State
  const [imageUrl, setImageUrl] = useState('')
  const [imageModel, setImageModel] = useState('')

  // Image load error tracking state
  const [imageError, setImageError] = useState(false)

  // Download processing state
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!memoryStarted || memoryHidden) return
    if (timer <= 0) {
      setMemoryHidden(true)
      return
    }
    const t = window.setTimeout(() => setTimer(v => v - 1), 1000)
    return () => window.clearTimeout(t)
  }, [memoryStarted, memoryHidden, timer])

  const startMemory = () => {
    setTimer(10)
    setMemoryHidden(false)
    setMemoryStarted(true)
    setResult('')
    setFeedback([])
    setImprovedPrompt('')
    setImageUrl('')
    setError('')
  }

  // Real AI Prompt Evaluation using Groq
  const analyze = async () => {
    setError('')
    setResult('')
    setFeedback([])
    setImprovedPrompt('')

    if (!prompt.trim()) {
      setError('Write a prompt first, then submit it.')
      return
    }

    setBusy(true)
    setBusyAction('evaluate')

    try {
      const evaluation = await evaluatePromptWithGroq(
        game.title,
        game.description,
        prompt.trim()
      )

      setResult(`AI prompt-quality score: ${evaluation.score}/100`)
      setFeedback(evaluation.feedback)
      setImprovedPrompt(evaluation.improvedPrompt)

      // Save stats/XP on evaluation/attempt
      if (user?.uid) {
        await updateUserStats(user.uid, { xpGained: Math.round(evaluation.score * 0.3), gameId })
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown evaluation error.'
      setError(`AI evaluation failed: ${message}.`)
    } finally {
      setBusy(false)
      setBusyAction('')
    }
  }

  const generate = async () => {
    setError('')
    setImageUrl('')
    if (!prompt.trim()) {
      setError('Write a prompt first, then generate an image.')
      return
    }

    setBusy(true)
    setBusyAction('generate')

    try {
      const encodedPrompt = encodeURIComponent(prompt.trim())
      const seed = Math.floor(Math.random() * 1000000)
      const generatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=768&nologo=true`

      await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => reject(new Error('Image generation service timed out. Please try again.'))
        img.src = generatedUrl
      })

      setImageUrl(generatedUrl)
      setImageModel('Pollinations Turbo Diffusion')

      // Save stats/XP to Firebase on successful image generation
      if (user?.uid) {
        await updateUserStats(user.uid, { xpGained: 25, gameId })
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown image generation error.'
      setError(`Image generation failed: ${message}.`)
    } finally {
      setBusy(false)
      setBusyAction('')
    }
  }

  // Robust blob-download handler to bypass CORS restrictions
  const handleDownload = async () => {
    if (!imageUrl) return
    setDownloading(true)
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `promnexa-${gameId}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Blob download failed, opening in new tab:', err)
      window.open(imageUrl, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  const Icon = game.icon
  
  const assetImageSrc = gameId === 'memory' 
    ? `/assets/memory-${currentLevel}.png` 
    : `/assets/${currentLevel}-ref.png`

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', color: '#fff' }}>
      <Link 
        to="/games" 
        style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          color: 'rgba(255,255,255,0.6)', textDecoration: 'none', 
          fontSize: '13px', fontWeight: 600, marginBottom: '24px',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
      >
        <ArrowLeft size={15} /> Back to game arena
      </Link>
      
      {/* Game Header */}
      <div style={{ 
        display: 'flex', alignItems: 'flex-start', gap: '20px', 
        background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(225, 29, 72, 0.3)', 
        borderRadius: '20px', padding: '32px', marginBottom: '32px', backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ 
          width: '54px', height: '54px', borderRadius: '14px', 
          background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          border: '1px solid rgba(225, 29, 72, 0.4)', flexShrink: 0,
          boxShadow: '0 0 15px rgba(225, 29, 72, 0.2)'
        }}>
          <Icon size={26} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            {game.tag}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: '#fff' }}>
            {game.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0, lineHeight: 1.5, maxWidth: '700px' }}>
            {game.description}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {(gameId === 'rebuild' || gameId === 'memory' || gameId === 'detective') && (
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(0, 0, 0, 0.2)', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
                  <Eye size={15} color="#e11d48" /> 
                  {gameId === 'memory' 
                    ? `MEMORY TARGET — ${currentLevel.toUpperCase()} LEVEL` 
                    : gameId === 'detective' 
                    ? 'CASE FILE / VISUAL CLUES' 
                    : `REFERENCE ART — ${currentLevel.toUpperCase()} LEVEL`}
                </span>
                
                {(gameId === 'rebuild' || gameId === 'memory') && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(['easy', 'medium', 'hard'] as const).map(lvl => (
                      <button 
                        key={lvl}
                        style={{ 
                          padding: '6px 14px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', cursor: 'pointer',
                          background: currentLevel === lvl ? '#e11d48' : 'rgba(255, 255, 255, 0.05)',
                          color: currentLevel === lvl ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                          border: currentLevel === lvl ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.2s ease',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                        onClick={() => { setCurrentLevel(lvl); setImageError(false); setMemoryStarted(false); setMemoryHidden(false); }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                )}

                {gameId === 'memory' && (
                  <span style={{ background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Timer size={14} /> {memoryHidden ? 'HIDDEN' : memoryStarted ? `${timer}s` : '10s'}
                  </span>
                )}
              </div>

              {memoryHidden ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: '#0a0d14', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <ShieldAlert size={36} color="#e11d48" />
                  <b style={{ fontSize: '16px', color: '#fff' }}>Image hidden</b>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Write what you remember below.</p>
                </div>
              ) : (
                <div style={{ position: 'relative', overflow: 'hidden', background: '#0a0d14', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', padding: '20px' }}>
                  {!imageError ? (
                    <img 
                      src={assetImageSrc} 
                      alt={`Reference target for ${currentLevel}`} 
                      style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', display: 'block', borderRadius: '8px' }} 
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                      <ImageIcon size={36} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '12px' }} />
                      <b style={{ color: '#fff', fontSize: '14px' }}>Image file not found</b>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '6px 0 0 0' }}>
                        Place <code>{gameId === 'memory' ? `memory-${currentLevel}.png` : `${currentLevel}-ref.png`}</code> inside your <code>public/assets/</code> folder.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {gameId === 'memory' && (
                <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center' }}>
                  <button 
                    style={{
                      background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.4)',
                      padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={startMemory}
                  >
                    {memoryStarted && !memoryHidden ? 'Restart 10-second timer' : 'Start 10-second observation'}
                  </button>
                </div>
              )}
            </div>
          )}

          {gameId === 'repair' && (
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#fb7185', letterSpacing: '0.05em' }}>
                  <Wrench size={16} /> PROMPT TO REPAIR
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(225,29,72,0.15)', color: '#fb7185', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(225,29,72,0.3)', fontWeight: 700 }}>STARTER</span>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                "A beautiful place with a person."
              </p>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setPrompt('A young traveler wearing a rust-red jacket standing on a rocky mountain viewpoint at golden hour, distant layered mountains, warm rim lighting, wide cinematic composition, realistic photography.')}
              >
                Use an example repair <ArrowRight size={14} />
              </button>
            </div>
          )}

          {gameId === 'battle' && (
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#fb7185', letterSpacing: '0.05em' }}>
                  <Swords size={16} /> CHALLENGE BRIEF
                </span>
                <span style={{ fontSize: '10px', background: 'rgba(225,29,72,0.15)', color: '#fb7185', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(225,29,72,0.3)', fontWeight: 700 }}>SOLO PRACTICE</span>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                Create a cinematic image of a lone explorer standing before an enormous ancient doorway carved into a mountain.
              </p>
              <small style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Solo practice session active with real-time prompt evaluation.</small>
            </div>
          )}

          {/* Prompt Editor */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(0, 0, 0, 0.2)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
                <WandSparkles size={15} color="#e11d48" /> YOUR PROMPT
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                {prompt.trim() ? prompt.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            
            <div style={{ padding: '20px 24px' }}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={gameId === 'memory' ? 'Write every detail you remember: subject, colors, lighting, background, composition…' : 'Describe the image you want to create in as much useful detail as you can…'}
                rows={6}
                style={{
                  width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '14px', lineHeight: 1.6,
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(225, 29, 72, 0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                  Tip: subject + setting + lighting + composition + details
                </span>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease'
                    }}
                    onClick={analyze} 
                    disabled={busy}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  >
                    {busy && busyAction === 'evaluate' ? 'Evaluating…' : 'Evaluate prompt'} <Target size={15} />
                  </button>

                  <button 
                    style={{
                      background: '#e11d48', color: '#fff', border: 'none',
                      padding: '10px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)',
                      transition: 'all 0.2s ease'
                  }}
                    onClick={generate} 
                    disabled={busy}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f43f5e'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#e11d48'}
                  >
                    {busy && busyAction === 'generate' ? 'Generating…' : 'Generate image'} <ArrowRight size={15} />
                  </button>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {result && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
                <Target size={15} /> AI PROMPT FEEDBACK
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', background: 'rgba(225,29,72,0.15)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(225,29,72,0.3)' }}>
                {result}
            </span>
            </div>
            <ul style={{ margin: '0 0 20px 0', paddingLeft: '20px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
              {feedback.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            {improvedPrompt && (
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
                <b style={{ display: 'block', fontSize: '12px', color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Suggested improved prompt
                </b>
                <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace', lineHeight: 1.5 }}>
                  {improvedPrompt}
                </p>
                <button 
                  style={{
                    background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.4)',
                    padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setPrompt(improvedPrompt)}
                >
                  Use improved prompt
                </button>
              </div>
            )}
          </div>
        )}

        {imageUrl && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
                <ImageIcon size={15} /> GENERATED IMAGE
          </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{imageModel}</span>
            </div>

            <div style={{ width: '100%', maxHeight: '480px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', overflow: 'hidden', margin: '16px 0', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px' }}>
              <img 
                src={imageUrl} 
                alt="AI-generated result for your prompt" 
                style={{ maxWidth: '100%', maxHeight: '460px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', borderRadius: '6px' }} 
          />
          </div>

          <button 
              onClick={handleDownload}
              disabled={downloading}
              style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', 
                  background: 'rgba(255, 255, 255, 0.05)', color: '#fff', 
                  cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', 
                  fontSize: '13px', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease'
              }}
          >
              <Download size={15} /> {downloading ? 'Downloading...' : 'Download image'}
          </button>
          </div>
        )}

        {busy && busyAction === 'generate' && !imageUrl && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#94a3b8', backdropFilter: 'blur(12px)' }}>
            <div style={{ width: '36px', height: '36px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#e11d48', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
            <p style={{ fontSize: '13px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Generating image...</p>
          </div>
        )}
    </section>

    {/* Sidebar */}
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', letterSpacing: '0.05em' }}>
            <Lightbulb size={15} /> HOW TO PLAY
          </div>
          <ol style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.5 }}>
            {game.instructions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', letterSpacing: '0.05em' }}>
            <Sparkles size={15} /> PROMPT FORMULA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fb7185', background: 'rgba(225,29,72,0.15)', padding: '2px 6px', borderRadius: '6px' }}>01</span>
              <div><b style={{ color: '#fff', display: 'block' }}>Subject</b><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>What is in the image?</span></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fb7185', background: 'rgba(225,29,72,0.15)', padding: '2px 6px', borderRadius: '6px' }}>02</span>
              <div><b style={{ color: '#fff', display: 'block' }}>Setting</b><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Where and when?</span></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fb7185', background: 'rgba(225,29,72,0.15)', padding: '2px 6px', borderRadius: '6px' }}>03</span>
              <div><b style={{ color: '#fff', display: 'block' }}>Lighting + camera</b><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>How is it shown?</span></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fb7185', background: 'rgba(225,29,72,0.15)', padding: '2px 6px', borderRadius: '6px' }}>04</span>
              <div><b style={{ color: '#fff', display: 'block' }}>Fine details</b><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>What makes it specific?</span></div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '20px', padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center', backdropFilter: 'blur(12px)' }}>
          <div style={{ color: '#fb7185', flexShrink: 0 }}>
            <Sparkles size={22} />
          </div>
          <div>
            <b style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
              {firebaseConfigured ? 'Firebase & AI Connected' : 'Setup needed'}
            </b>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
              {firebaseConfigured ? 'Live generation active via Pollinations Fast-Gen.' : 'Configure Firebase in your .env file.'}
            </p>
          </div>
        </div>
    </aside>
    </div>
  </div>
)
}