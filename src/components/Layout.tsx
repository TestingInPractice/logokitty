import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header className="header">
        <span className="header-title">Логокотик</span>
      </header>
      <main style={{ flex: 1, overflow: 'auto' }}><Outlet /></main>
    </div>
  )
}
