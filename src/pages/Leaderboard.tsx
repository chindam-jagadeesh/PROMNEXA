import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, Crown, Trophy, Medal, Zap, Flame, 
  Search, Shield, ChevronRight, Award, Sparkles 
} from 'lucide-react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import { useAuth } from '../lib/AuthContext'

interface LeaderboardUser {
  id: string
  name: string
  avatarText: string
  xp: number
  level: number
  totalAttempts: number
  rank: number
  tier: 'Grandmaster' | 'Master' | 'Diamond' | 'Platinum' | 'Gold'
}

// Compute tier dynamically based on actual XP earned
function computeTier(xp: number): LeaderboardUser['tier'] {
  if (xp >= 5000) return 'Grandmaster'
  if (xp >= 3000) return 'Master'
  if (xp >= 1500) return 'Diamond'
  if (xp >= 500) return 'Platinum'
  return 'Gold'
}

function getTierStyle(tier: LeaderboardUser['tier']) {
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

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const usersRef = collection(getFirestoreDb(), 'users')
        const q = query(usersRef, orderBy('xp', 'desc'), limit(30))
        const snapshot = await getDocs(q)

        const rankedList: LeaderboardUser[] = snapshot.docs.map((docSnap, index) => {
          const data = docSnap.data()
          const rawName = data.displayName || (data.email ? data.email.split('@')[0] : `User_${docSnap.id.slice(0, 4)}`)
          const xp = Number(data.xp) || 0
          
          // FIXED: Uniformly compute level dynamically from XP to match Profile component calculations
          const level = Math.floor(xp / 100) + 1
          
          const totalAttempts = Number(data.totalAttempts) || 0
          const initials = rawName.slice(0, 2).toUpperCase()

          return {
            id: docSnap.id,
            name: rawName,
            avatarText: initials,
            xp,
            level,
            totalAttempts,
            rank: index + 1,
            tier: computeTier(xp)
          }
        })

        setLeaders(rankedList)
      } catch (err) {
        console.warn('Leaderboard fetch warning:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const filteredLeaders = leaders.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topThree = filteredLeaders.slice(0, 3)
  const currentUserEntry = leaders.find(l => l.id === user?.uid)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', color: '#fff' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225,29,72,0.12)', border: '1px solid rgba(225,29,72,0.28)', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', color: '#fb7185', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px' }}>
            <Trophy size={14} /> LIVE ARENA RANKINGS
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Community <span style={{ color: '#e11d48' }}>Leaderboard</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0, maxWidth: '520px' }}>
            Compete with visual engineers worldwide. Score precision points across all modes to ascend through the tiers.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: '#e11d48', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>COMPETITIVE CYCLE</div>
            <b style={{ fontSize: '15px', color: '#fff' }}>SEASON 01 ACTIVE</b>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '80px 20px', textAlign: 'center', backdropFilter: 'blur(16px)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#e11d48', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>Syncing Real-Time Rankings…</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '6px' }}>Fetching player profiles from Cloud Firestore</p>
        </div>
      ) : leaders.length === 0 ? (
        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '60px 24px', textAlign: 'center', backdropFilter: 'blur(16px)' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(225,29,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#fb7185' }}>
            <Crown size={34} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 10px 0' }}>Be the first on the board!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '440px', margin: '0 auto 24px auto', fontSize: '14px', lineHeight: 1.6 }}>
            No challenge scores recorded yet. Complete any prompt challenge to claim the #1 ranking.
          </p>
          <Link to="/games" className="button button-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', textDecoration: 'none', borderRadius: '10px' }}>
            Play your first challenge <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Showcase */}
          {topThree.length >= 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px', alignItems: 'end' }}>
              
              {/* 2nd Place */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                borderRadius: '22px',
                padding: '30px 24px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: '#94a3b8', color: '#0f172a', fontWeight: 800, fontSize: '12px', padding: '4px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Medal size={14} /> RANK #2
                </div>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #94a3b8, #475569)', margin: '14px auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,0.2)' }}>
                  {topThree[1].avatarText}
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700 }}>{topThree[1].name}</h3>
                <span style={{ fontSize: '11px', color: getTierStyle(topThree[1].tier).color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {topThree[1].tier}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0 0 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <div>
                    <small style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>LEVEL</small>
                    <b style={{ fontSize: '16px', color: '#fff' }}>Lvl {topThree[1].level}</b>
                  </div>
                  <div>
                    <small style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>TOTAL XP</small>
                    <b style={{ fontSize: '16px', color: '#38bdf8' }}>{topThree[1].xp.toLocaleString()}</b>
                  </div>
                </div>
              </div>

              {/* 1st Place Champion */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(225, 29, 72, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '2px solid rgba(225, 29, 72, 0.55)',
                borderRadius: '26px',
                padding: '38px 24px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(225, 29, 72, 0.25)',
                backdropFilter: 'blur(20px)',
                transform: 'scale(1.03)'
              }}>
                <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #f59e0b, #e11d48)', color: '#fff', fontWeight: 800, fontSize: '13px', padding: '6px 18px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 15px rgba(225,29,72,0.4)' }}>
                  <Crown size={16} /> CHAMPION #1
                </div>
                <div style={{ width: '82px', height: '82px', borderRadius: '50%', background: 'linear-gradient(135deg, #e11d48, #f59e0b)', margin: '12px auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: '#fff', border: '3px solid #fff', boxShadow: '0 0 25px rgba(225,29,72,0.6)' }}>
                  {topThree[0].avatarText}
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: 800 }}>{topThree[0].name}</h3>
                <span style={{ fontSize: '12px', color: '#fb7185', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  ✦ {topThree[0].tier} ✦
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '22px 0 0 0', borderTop: '1px solid rgba(225,255,255,0.12)', paddingTop: '16px' }}>
                  <div>
                    <small style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>LEVEL</small>
                    <b style={{ fontSize: '18px', color: '#fff' }}>Lvl {topThree[0].level}</b>
                  </div>
                  <div>
                    <small style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>ATTEMPTS</small>
                    <b style={{ fontSize: '18px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'center' }}>
                      <Flame size={15} /> {topThree[0].totalAttempts}
                    </b>
                  </div>
                  <div>
                    <small style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>TOTAL XP</small>
                    <b style={{ fontSize: '18px', color: '#fb7185' }}>{topThree[0].xp.toLocaleString()}</b>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                borderRadius: '22px',
                padding: '30px 24px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: '#d97706', color: '#fff', fontWeight: 800, fontSize: '12px', padding: '4px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Medal size={14} /> RANK #3
                </div>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #d97706, #78350f)', margin: '14px auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,0.2)' }}>
                  {topThree[2].avatarText}
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700 }}>{topThree[2].name}</h3>
                <span style={{ fontSize: '11px', color: getTierStyle(topThree[2].tier).color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {topThree[2].tier}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0 0 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <div>
                    <small style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>LEVEL</small>
                    <b style={{ fontSize: '16px', color: '#fff' }}>Lvl {topThree[2].level}</b>
                  </div>
                  <div>
                    <small style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>TOTAL XP</small>
                    <b style={{ fontSize: '16px', color: '#38bdf8' }}>{topThree[2].xp.toLocaleString()}</b>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Search Filter Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
              Showing <b>{filteredLeaders.length}</b> verified rankings
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder="Search engineer by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '9px 12px 9px 36px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(16px)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '70px 2.4fr 1.2fr 1fr 1.2fr', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <span>Rank</span>
              <span>Visual Engineer</span>
              <span>Skill Tier</span>
              <span style={{ textAlign: 'center' }}>Attempts</span>
              <span style={{ textAlign: 'right' }}>Total XP</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredLeaders.map((player) => {
                const isCurrentUser = user?.uid === player.id
                const tierStyle = getTierStyle(player.tier)

                return (
                  <div
                    key={player.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '70px 2.4fr 1.2fr 1fr 1.2fr',
                      alignItems: 'center',
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isCurrentUser 
                        ? 'rgba(225, 29, 72, 0.12)' 
                        : 'transparent',
                      borderLeft: isCurrentUser ? '3px solid #e11d48' : '3px solid transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {/* Rank Badge */}
                    <div style={{ fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      {player.rank === 1 ? (
                        <Crown size={18} color="#f59e0b" />
                      ) : player.rank === 2 ? (
                        <Medal size={18} color="#94a3b8" />
                      ) : player.rank === 3 ? (
                        <Medal size={18} color="#d97706" />
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.4)', paddingLeft: '4px' }}>#{player.rank}</span>
                      )}
                    </div>

                    {/* Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isCurrentUser ? 'linear-gradient(135deg, #e11d48, #f43f5e)' : 'rgba(255,255,255,0.07)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {player.avatarText}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: isCurrentUser ? '#fb7185' : '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {player.name}
                          {isCurrentUser && (
                            <span style={{ background: '#e11d48', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>YOU</span>
                          )}
                        </div>
                        <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Level {player.level}</small>
                      </div>
                    </div>

                    {/* Tier Pill */}
                    <div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: tierStyle.color,
                        background: tierStyle.bg,
                        border: `1px solid ${tierStyle.border}`,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        {player.tier}
                      </span>
                    </div>

                    {/* Attempts */}
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500 }}>
                      {player.totalAttempts} played
                    </div>

                    {/* Total XP */}
                    <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '15px', color: '#fff' }}>
                      {player.xp.toLocaleString()} <span style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700 }}>XP</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active User Rank Indicator */}
          {currentUserEntry && (
            <div style={{
              marginTop: '28px',
              background: 'linear-gradient(90deg, rgba(225,29,72,0.18) 0%, rgba(15,23,42,0.85) 100%)',
              border: '1px solid rgba(225,29,72,0.35)',
              borderRadius: '16px',
              padding: '20px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#e11d48', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>YOUR LIVE PROFILE</div>
                  <h4 style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: 700 }}>
                    You are ranked <b>#{currentUserEntry.rank}</b> with <b>{currentUserEntry.xp.toLocaleString()} XP</b> ({currentUserEntry.tier})
                  </h4>
                </div>
              </div>

              <Link
                to="/games"
                style={{
                  background: '#e11d48',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(225,29,72,0.3)'
                }}
              >
                Play Challenge <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </>
      )}

      {/* Rules Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
          <Trophy size={18} style={{ color: '#e11d48', marginBottom: '8px' }} />
          <b style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Live Evaluation Sync</b>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            XP calculations are automatically updated whenever an evaluation or rebuild attempt is completed.
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
          <Shield size={18} style={{ color: '#38bdf8', marginBottom: '8px' }} />
          <b style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Firestore Powered</b>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            Profiles and level stats are securely verified and synced across the active season database.
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
          <Sparkles size={18} style={{ color: '#facc15', marginBottom: '8px' }} />
          <b style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Tier Progression</b>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            Every 100 XP levels up your visual engineering tier, elevating your standing on the global board.
          </p>
        </div>
      </div>

    </div>
  )
}