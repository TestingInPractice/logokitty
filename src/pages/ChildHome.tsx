import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { sections } from '../api/data'
import LevelBar from '../components/LevelBar'

const COLOR_MAP: Record<string, string> = { orange: '#FF9E5E', gray: '#A0A0A0', white: '#F5F5F5', black: '#333', brown: '#8B6914' }

export default function ChildHome() {
  const n = useNavigate()
  const activeChildId = useStore(s => s.activeChildId)
  const child = useStore(s => s.children).find(c => c.id === activeChildId)
  const cat = useStore(s => s.cat)

  if (!child) return <div className="page"><button className="btn btn-primary" onClick={() => n('/child/create')}>Создать ребёнка</button></div>

  const bg = COLOR_MAP[cat?.color ?? 'orange']
  const stage = Math.ceil(child.level / 10)

  return (
    <div className="page">
      <div className="text-center" style={{ marginBottom: 24 }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: `0 4px 16px ${bg}66` }}>
          😺
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>{cat?.name}</div>
        <div className="row justify-center gap-8 mt-8">
          <span className="badge badge-orange">🐟 {child.foodBalance}</span>
          <span className="badge badge-gold">⭐ {child.goldBalance}</span>
        </div>
        <div className="mt-8"><LevelBar /></div>
      </div>

      <div className="section-grid">
        {sections.map(s => {
          const unlocked = stage >= s.stageRequired
          return (
            <button key={s.id} onClick={unlocked ? () => n(`/section/${s.id}`) : undefined}
              style={{
                background: unlocked ? 'linear-gradient(135deg,var(--orange),var(--pink))' : '#e0e0e0',
                borderRadius: 'var(--radius)', padding: 20, textAlign: 'center',
                opacity: unlocked ? 1 : 0.6, border: 'none', cursor: unlocked ? 'pointer' : 'default',
                minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 8, boxShadow: unlocked ? '0 4px 16px rgba(255,158,94,.3)' : 'none',
              }}>
              <span style={{ fontSize: 40 }}>{s.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: unlocked ? '#fff' : 'var(--text-light)' }}>{s.title}</span>
              <span style={{ fontSize: 11, color: unlocked ? 'rgba(255,255,255,.8)' : 'var(--text-light)' }}>{s.description}</span>
              {!unlocked && <span className="badge badge-gold" style={{ marginTop: 4 }}>🔒 {s.stageRequired}0 ур.</span>}
            </button>
          )
        })}
      </div>

      <div className="row justify-center" style={{ gap: 12, marginTop: 16 }}>
        <button className="btn btn-sm btn-outline" onClick={() => n('/shop')}>🛍️ Магазин</button>
        <button className="btn btn-sm btn-outline" onClick={() => n('/diagnostics')}>🩺 Диагностика</button>
        <button className="btn btn-sm btn-outline" onClick={() => n('/subscription')}>💎 Premium</button>
      </div>
    </div>
  )
}
