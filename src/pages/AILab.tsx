import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, FlaskConical, Lightbulb, SlidersHorizontal, 
  Sparkles, Download, Check, Target 
} from 'lucide-react'
import { evaluatePromptWithGroq, EvaluationResult } from '../lib/groqEvaluator'

export default function AILab() {
  const [style, setStyle] = useState('Cinematic')
  const [lighting, setLighting] = useState('Golden hour')
  const [camera, setCamera] = useState('Wide shot')
  const [detail, setDetail] = useState(65)
  const [subject, setSubject] = useState('A red fox exploring an ancient mossy forest')

  const [imageUrl, setImageUrl] = useState('')
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null)
  const [busy, setBusy] = useState<'generate' | 'evaluate' | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  // Detail level text translation
  const detailDesc = detail > 75 ? 'intricate fine textures' : detail > 40 ? 'clear visible textures' : 'simple clean details'
  const generated = `${subject.trim()}, ${style.toLowerCase()} style, ${lighting.toLowerCase()} lighting, ${camera.toLowerCase()} composition, rich environmental detail, ${detailDesc}.`

  const handleCopy = () => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 1. Trigger Real AI Evaluation when user clicks "AI Evaluate"
  const handleEvaluate = async () => {
    if (!subject.trim()) {
      setError('Please provide a subject first.')
      return
    }
    setError('')
    setFeedback(null)
    setBusy('evaluate')

    try {
      const result = await evaluatePromptWithGroq(
        "AI Lab Experiment", 
        "Analyze composed ingredient prompt.", 
        generated
      )
      setFeedback(result)
    } catch (err) {
      console.error(err)
      setError('AI evaluation failed. Please check your Groq API key.')
    } finally {
      setBusy(null)
    }
  }

  // 2. Trigger Real AI Image Generation when user clicks "Generate Image"
  const handleGenerate = async () => {
    if (!subject.trim()) {
      setError('Please provide a subject for your prompt.')
      return
    }
    setError('')
    setImageUrl('')
    setBusy('generate')

    try {
      const encoded = encodeURIComponent(generated)
      const seed = Math.floor(Math.random() * 1000000)
      const url = `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1024&height=768&nologo=true&enhance=true`

      // Preload image to ensure it loads cleanly
      await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => reject(new Error('Image generation timed out. Please try again.'))
        img.src = url
      })

      setImageUrl(url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed.'
      setError(message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', color: '#fff' }}>
      
      {/* Title Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            EXPERIMENT / OBSERVE / LEARN
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            The <span style={{ color: '#e11d48' }}>AI Lab.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0, maxWidth: '520px', lineHeight: 1.6 }}>
            Select your prompt ingredients using the controls, then click Generate to render results or evaluate with Real AI.
          </p>
        </div>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.4)', padding: '10px 18px', borderRadius: '14px', fontSize: '12px', fontWeight: 700, color: '#fb7185', backdropFilter: 'blur(8px)', boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)' }}>
          <FlaskConical size={17} />
          <span>EXPERIMENT MODE</span>
        </div>
      </div>

      {/* Lab Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '28px', alignItems: 'start' }}>
        
        {/* Controls Panel */}
        <section style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '28px', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
              <SlidersHorizontal size={15} /> PROMPT INGREDIENTS
            </span>
            <span style={{ fontSize: '10px', background: 'rgba(225,29,72,0.15)', color: '#fb7185', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(225,29,72,0.3)', fontWeight: 700 }}>
              MANUAL COMPOSER
            </span>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            Core idea
            <input
              value={subject}
              onChange={e => { setSubject(e.target.value); setFeedback(null); }}
              placeholder="Describe your subject..."
              style={{
                background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(225, 29, 72, 0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
            />
          </label>

          {[
            { label: 'Visual style', value: style, setter: setStyle, options: ['Cinematic', 'Photorealistic', 'Watercolor', '3D render', 'Anime', 'Editorial', 'Cyberpunk', 'Oil Painting'] },
            { label: 'Lighting', value: lighting, setter: setLighting, options: ['Golden hour', 'Soft studio light', 'Neon night', 'Overcast daylight', 'Moonlight', 'Dramatic backlight', 'Bioluminescent glow'] },
            { label: 'Camera / composition', value: camera, setter: setCamera, options: ['Wide shot', 'Close-up', 'Low angle', 'Overhead view', 'Portrait framing', 'Macro shot', 'Cinematic drone view'] },
          ].map(input => (
            <label key={input.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
              {input.label}
              <select 
                value={input.value} 
                onChange={e => { input.setter(e.target.value); setFeedback(null); }}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {input.options.map(v => (
                  <option key={v} value={v} style={{ background: '#0f172a', color: '#fff' }}>{v}</option>
                ))}
              </select>
            </label>
          ))}

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Detail level</span>
              <span style={{ fontFamily: 'monospace', color: '#fb7185' }}>{detail}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={detail}
              onChange={e => { setDetail(Number(e.target.value)); setFeedback(null); }}
              style={{ accentColor: '#e11d48', cursor: 'pointer', height: '6px' }}
            />
          </label>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              style={{
                background: '#e11d48', color: '#fff', border: 'none', flex: 1,
                padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', 
                boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)', transition: 'all 0.2s ease'
              }}
              onClick={handleGenerate}
              disabled={busy !== null}
              onMouseEnter={e => e.currentTarget.style.background = '#f43f5e'}
              onMouseLeave={e => e.currentTarget.style.background = '#e11d48'}
            >
              {busy === 'generate' ? 'Generating...' : 'Generate Image'} <Sparkles size={14} />
            </button>

            <button
              style={{
                background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease'
              }}
              onClick={handleEvaluate}
              disabled={busy !== null}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              {busy === 'evaluate' ? 'Evaluating...' : 'AI Evaluate'} <Target size={14} />
            </button>
          </div>
        </section>

        {/* Output Panel */}
        <section style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '28px', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }}>
          
          {/* Prompt Display */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>COMPOSED PROMPT STRING</span>
                <button
                  onClick={handleCopy}
                  style={{
                    background: 'none', border: 'none', color: copied ? '#4ade80' : 'rgba(255,255,255,0.6)', 
                    cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0
                  }}
                >
                  {copied ? <Check size={12} /> : <Download size={12} />} {copied ? 'Copied!' : 'Copy'}
                </button>
             </div>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px', color: '#fb7185', lineHeight: 1.6, wordBreak: 'break-word' }}>
              {generated}
            </p>
          </div>

          {/* AI Evaluation Feedback */}
          {feedback && (
             <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(225, 29, 72, 0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Target size={15} />AI ANALYSIS
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', background: 'rgba(225,29,72,0.2)', padding: '2px 8px', borderRadius: '8px' }}>
                    Score: {feedback.score}/100
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: 1.5 }}>
                    {feedback.feedback.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
             </div>
          )}

          {/* Image Preview / Loading State */}
          {imageUrl && busy !== 'generate' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '100%', maxHeight: '420px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0d14', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px' }}>
                <img
                  src={imageUrl}
                  alt="AI synthesized visualization"
                  style={{ maxWidth: '100%', maxHeight: '400px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', borderRadius: '6px' }}
                />
              </div>
              <a
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)', color: '#fff', textDecoration: 'none',
                  padding: '10px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                  border: '1px solid rgba(255, 255, 255, 0.1)', width: 'fit-content', transition: 'all 0.2s ease'
                }}
                href={imageUrl}
                download={`ailab-${style.toLowerCase()}-${Date.now()}.png`}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={14} /> Save Full Res
              </a>
            </div>
          ) : busy === 'generate' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#0a0d14', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <div style={{ width: '32px', height: '32px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#e11d48', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '14px' }} />
              <span style={{ fontSize: '13px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>Generating image from your prompt...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#0a0d14', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'rgba(255,255,255,0.3)', gap: '12px' }}>
              <FlaskConical size={42} color="#e11d48" style={{ opacity: 0.6 }} />
              <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>READY TO GENERATE IMAGE</span>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '4px 0' }} />
          
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: '#fff' }}>Want to test your prompts in challenges?</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px 0', lineHeight: 1.5 }}>Take what you've learned from composing prompts and earn XP in the Arena.</p>
            <Link to="/games/freestyle" style={{ color: '#fb7185', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Open FreeStyle Studio <ArrowRight size={15} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}