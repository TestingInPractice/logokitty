import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

const tabs = [
  { path: '/feed', icon: '🏠', label: 'Лента' },
  { path: '/child', icon: '🐱', label: 'Ребёнок' },
  { path: '/shop', icon: '🛍️', label: 'Магазин' },
  { path: '/settings', icon: '⚙️', label: 'Настройки' },
]

export default function Layout() {
  const n = useNavigate(); const loc = useLocation(); const id = useStore(s => s.activeChildId)
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <header className="header">
        <span className="header-title">Логокотик</span>
        {loc.pathname === '/child' && <button className="btn btn-sm btn-outline" onClick={() => n('/feed')}>К родителю</button>}
      </header>
      <main style={{ flex:1, overflow:'auto' }}><Outlet /></main>
      <nav style={{ display:'flex', background:'#fff', borderTop:'1px solid #f0e8e0', padding:'8px 0', paddingBottom:'max(8px,env(safe-area-inset-bottom))' }}>
        {tabs.map(t => (
          <button key={t.path} onClick={() => { if (t.path==='/child' && !id) return; n(t.path) }}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'4px 0', background:'transparent', fontSize:12,
              fontWeight: loc.pathname.startsWith(t.path) ? 700 : 400,
              color: loc.pathname.startsWith(t.path) ? 'var(--orange-dark)' : 'var(--text-light)',
              opacity: t.path==='/child' && !id ? 0.4 : 1 }}>
            <span style={{ fontSize:22 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
