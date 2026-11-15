import { useEffect, useState } from 'react'
import { User, Trophy, Zap, Shield, Mail, Award, Edit3, Check, Flame, Star, Activity, Sparkles, Medal } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getUserStats, UserStats } from '../lib/gameService'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'

// Compute tier dynamically based on actual XP earned (matches Leaderboard logic)
function computeTier(xp: number): 'Grandmaster' | 'Master' | 'Diamond' | 'Platinum' | 'Gold' {
  if (xp >= 5000) return 'Grandmaster'
  if (xp >= 3000) return 'Master'
  if (xp >= 1500) return 'Diamond'
  if (xp >= 500) return 'Platinum'
  return 'Gold'
}

function getTierStyle(tier: string) {
  switch (tier) {
    case 'Grandmaster':
      return { color: '#fb7185', bg: 'rgba(225, 29, 72, 0.15)', border: 'rgba(225, 29, 72, 0.35)' }
    case 'Master':
      return { color: '#c084fc', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.35)' }
    case 'Diamond':
      return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)' }
    case 'Platinum':
      return { color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.15)', border: 'rgba(45, 212, 191, 0.35)' }
    default:
      return { color: '#facc15', bg: 'rgba(250, 204, 21, 0.15)', border: 'rgba(250, 204, 21, 0.35)' }
  }
}

export default function Profile() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    totalAttempts: 0,
    gamesPlayed: {}
  })
  
  const [displayName, setDisplayName] = useState('Chindam Jagadeesh')
  const [bio, setBio] = useState('Prompt Architect & AI Visual Explorer crafting the future of prompts.')
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('Chindam Jagadeesh')
  const [tempBio, setTempBio] = useState('Prompt Architect & AI Visual Explorer crafting the future of prompts.')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadUserData() {
      if (!user?.uid) return
      try {
        const userStats = await getUserStats(user.uid)
        setStats(userStats)

        const userDocRef = doc(getFirestoreDb(), 'users', user.uid)
        const userSnap = await getDoc(userDocRef)
        if (userSnap.exists()) {
          const data = userSnap.data()
          if (data.displayName || data.name) {
            setDisplayName(data.displayName || data.name)
            setTempName(data.displayName || data.name)
          }
          if (data.bio) {
            setBio(data.bio)
            setTempBio(data.bio)
          }
        } else if (user.displayName) {
          setDisplayName(user.displayName)
          setTempName(user.displayName)
        }
      } catch (err) {
        console.warn('Failed to load profile data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUserData()
  }, [user])

  const handleSaveProfile = async () => {
    if (!user?.uid || !tempName.trim()) return
    setSaving(true)
    try {
      const userDocRef = doc(getFirestoreDb(), 'users', user.uid)
      await setDoc(userDocRef, { 
        displayName: tempName.trim(),
        bio: tempBio.trim()
      }, { merge: true })
      setDisplayName(tempName.trim())
      setBio(tempBio.trim())
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const userEmail = user?.email || 'jagadeesh@example.com'
  const userInitial = displayName ? displayName[0].toUpperCase() : 'C'

  // Determine favorite game based on plays or default
  const favoriteGame = Object.entries(stats.gamesPlayed || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'FreeStyle Studio'

  // Compute tier dynamically based on XP
  const currentTier = computeTier(stats.xp)
  const tierStyle = getTierStyle(currentTier)

  // Achievement unlock conditions array with names, unlock requirements, status, and icons
  const achievementStatuses = [
    { name: 'First Spark', desc: 'Completed first prompt', unlocked: true, icon: '✦' },
    { name: 'Prompt Adept', desc: '5+ challenges logged', unlocked: stats.totalAttempts >= 5, icon: '⚡' },
    { name: 'Rising Star', desc: 'Reach Level 3', unlocked: stats.level >= 3, icon: '🏆' },
    { name: 'Prompt Perfectionist', desc: '1,000+ total XP', unlocked: stats.xp >= 1000, icon: '🎯' },
    { name: 'Arena Veteran', desc: '15+ challenges logged', unlocked: stats.totalAttempts >= 15, icon: '⚔️' },
    { name: 'Master Architect', desc: 'Reach Level 5', unlocked: stats.level >= 5, icon: '👑' },
    { name: 'Alchemist Supreme', desc: '2,500+ total XP', unlocked: stats.xp >= 2500, icon: '🧪' },
    { name: 'Dedicated Explorer', desc: 'Reach Level 20', unlocked: stats.level >= 20, icon: '🧭' },
    { name: 'Diamond Vanguard', desc: 'Reach Level 35', unlocked: stats.level >= 35, icon: '💎' },
    { name: 'Grandmaster Legend', desc: 'Reach Level 50+', unlocked: stats.level >= 50, icon: '🌟' }
  ]

  const unlockedAchievementsCount = achievementStatuses.filter(a => a.unlocked).length

  // Dynamically find the highest unlocked achievement badge for the profile header
  const unlockedList = achievementStatuses.filter(a => a.unlocked)
  const highestAchievement = unlockedList.length > 0 ? unlockedList[unlockedList.length - 1] : achievementStatuses[0]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px', color: '#fff' }}>
      
      {/* Page Title Row */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
          ACCOUNT MANAGEMENT
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>
          Your <span style={{ color: '#e11d48' }}>Profile.</span>
        </h1>
      </div>

      {/* Main Profile Header Card */}
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.7)', 
        border: '1px solid rgba(225, 29, 72, 0.3)', 
        borderRadius: '24px', 
        padding: '36px', 
        marginBottom: '28px',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '28px', flexWrap: 'wrap', flex: 1 }}>
          {/* Avatar Ring */}
          <div style={{ 
            width: '88px', height: '88px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #e11d48, #881337)', 
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '2.2rem', fontWeight: 800, boxShadow: '0 0 25px rgba(225, 29, 72, 0.4)',
            border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0
          }}>
            {userInitial}
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
              
              {/* Highest Unlocked Achievement Badge replacing Prompt Architect */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(225,29,72,0.3)' }}>
                <span>{highestAchievement.icon}</span> {highestAchievement.name.toUpperCase()}
              </div>
              
              {/* Dynamic Skill Tier Badge */}
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '6px', 
                background: tierStyle.bg, color: tierStyle.color, 
                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, 
                border: `1px solid ${tierStyle.border}`, textTransform: 'uppercase', letterSpacing: '0.04em' 
              }}>
                <Medal size={12} /> {currentTier} TIER
              </div>
            </div>
            
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '4px 0', maxWidth: '450px' }}>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Display Name"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(225, 29, 72, 0.5)',
                    borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '1.1rem', fontWeight: 700, outline: 'none'
                  }}
                />
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Write a short bio..."
                  rows={2}
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(225, 29, 72, 0.3)',
                    borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'none'
                  }}
                />
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  style={{
                    background: '#e11d48', color: '#fff', border: 'none', padding: '10px 18px',
                    borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, width: 'fit-content'
                  }}
                >
                  <Check size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0', color: '#fff' }}>
                    {displayName}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                    title="Edit Profile"
                    onMouseEnter={e => e.currentTarget.style.color = '#fb7185'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '0 0 10px 0', lineHeight: 1.5, maxWidth: '500px' }}>
                  {bio}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} /> {userEmail}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        {/* Total XP */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', backdropFilter: 'blur(12px)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Total XP</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              {loading ? '...' : stats.xp} <span style={{ fontSize: '14px', color: '#fcd34d' }}>XP</span>
            </div>
          </div>
        </div>

        {/* Current Level */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', backdropFilter: 'blur(12px)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(225, 29, 72, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185', border: '1px solid rgba(225,29,72,0.3)' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Level</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              0{stats.level}
            </div>
          </div>
        </div>

        {/* Challenges Completed */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', backdropFilter: 'blur(12px)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', border: '1px solid rgba(139,92,246,0.3)' }}>
            <Trophy size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Challenges</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              {loading ? '...' : stats.totalAttempts}
            </div>
          </div>
        </div>

        {/* Favorite Focus */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', backdropFilter: 'blur(12px)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
            <Flame size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Top Arena</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>
              {String(favoriteGame)}
            </div>
          </div>
        </div>

      </div>

      {/* Achievement Badges Section */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '28px', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', letterSpacing: '0.05em' }}>
          <Star size={16} /> UNLOCKED ACHIEVEMENTS ({unlockedAchievementsCount} / 10)
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          {achievementStatuses.map((ach, index) => (
            <div key={index} style={{ 
              background: ach.unlocked ? 'rgba(225, 29, 72, 0.08)' : 'rgba(255,255,255,0.02)', 
              border: ach.unlocked ? '1px solid rgba(225, 29, 72, 0.25)' : '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '14px', 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              opacity: ach.unlocked ? 1 : 0.5 
            }}>
              <div style={{ 
                width: '38px', height: '38px', borderRadius: '10px', 
                background: ach.unlocked ? '#e11d48' : 'rgba(255,255,255,0.1)', 
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 700, fontSize: '16px', flexShrink: 0 
              }}>
                {ach.icon}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <b style={{ display: 'block', fontSize: '13px', color: '#fff' }}>{ach.name}</b>
                <small style={{ color: ach.unlocked ? '#fb7185' : 'rgba(255,255,255,0.4)', fontSize: '11px', display: 'block' }}>
                  {ach.desc}
                </small>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  )
}