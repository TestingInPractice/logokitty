import { Outlet, useNavigate } from 'react-router-dom'
import InstallPrompt from './InstallPrompt'

export default function Layout() {
  const n = useNavigate()
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header className="header">
        <div style={{ flex: 1 }}>
          <span className="header-title" style={{ cursor: 'pointer' }} onClick={() => n('/')}>Логокотик</span>
        </div>
        <button style={{ background: 'none', fontSize: 18 }} onClick={() => n('/settings')}>⚙️</button>
      </header>
      <main style={{ flex: 1, overflow: 'auto' }}><Outlet /></main>
      <InstallPrompt />
    </div>
  )
}
