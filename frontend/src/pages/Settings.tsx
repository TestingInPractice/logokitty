import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Settings() {
  const n = useNavigate(); const user = useStore(s => s.user); const children = useStore(s => s.children)
  const setUser = useStore(s => s.setUser); const setChildren = useStore(s => s.setChildren)
  const setAID = useStore(s => s.setActiveChildId); const setPage = useStore(s => s.setPage)
  const logout = () => { localStorage.clear(); setUser(null); setChildren([]); setAID(null); setPage('auth'); n('/auth') }
  return <div className="page">
    <div className="text-center mb-16"><div style={{fontSize:48,marginBottom:8}}>⚙️</div><div className="text-lg">Настройки</div></div>
    <div className="card">
      <div style={{fontWeight:600,marginBottom:12}}>Профиль</div>
      <div className="achievement"><span className="achievement-icon">👤</span>
        <div><div className="achievement-text">{user?.name}</div><div className="achievement-time">ID: {user?.id?.slice(0,8)}</div></div>
      </div>
    </div>
    <div className="card">
      <div style={{fontWeight:600,marginBottom:12}}>Дети</div>
      {children.map(c => <div key={c.id} className="achievement"><span className="achievement-icon">👶</span>
        <div><div className="achievement-text">{c.name}</div><div className="achievement-time">{c.age} года • Уровень {c.level}</div></div>
      </div>)}
    </div>
    <div className="card">
      <div style={{fontWeight:600,marginBottom:12}}>О приложении</div>
      <div className="achievement"><span className="achievement-icon">🐱</span>
        <div><div className="achievement-text">Логокотик v0.1.0</div><div className="achievement-time">Логопедическое PWA</div></div>
      </div>
    </div>
    <button className="btn btn-pink mt-16" onClick={logout}>Выйти</button>
  </div>
}
