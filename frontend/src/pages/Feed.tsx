import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import DailyReward from '../components/DailyReward'
import LevelBar from '../components/LevelBar'
import CurrencyBar from '../components/CurrencyBar'
import CatMascot from '../components/CatMascot'

const achievements = [
  { icon:'🎮', text:'Прошёл игру "Найди звук"', time:'2 часа назад' },
  { icon:'🔊', text:'Освоен звук "С"', time:'Вчера' },
  { icon:'⬆️', text:'Достигнут уровень 2', time:'Вчера' },
]

export default function Feed() {
  const n = useNavigate(); const user = useStore(s => s.user); const children = useStore(s => s.children)
  const id = useStore(s => s.activeChildId); const child = children.find(c => c.id === id)
  return <div className="page">
    <div className="row-between mb-16">
      <div className="row">
        <div className="avatar">{user?.name?.[0]||'?'}</div>
        <div><div style={{fontWeight:700}}>{user?.name}</div><div className="text-muted" style={{fontSize:12}}>Родитель</div></div>
      </div>
      <CurrencyBar />
    </div>
    <DailyReward />
    {child && <div className="card mt-16" onClick={()=>n('/child')} style={{cursor:'pointer'}}>
      <div className="row-between">
        <div className="row gap-8">
          <CatMascot size={56} />
          <div><div style={{fontWeight:700,fontSize:16}}>{child.name}</div><div className="text-muted" style={{fontSize:12}}>{child.age} года</div></div>
        </div>
        <span style={{fontSize:20}}>▶️</span>
      </div>
      <div style={{marginTop:12}}><LevelBar /></div>
    </div>}
    <div className="card mt-8">
      <div style={{fontWeight:700,fontSize:16,marginBottom:12}}>Последние достижения</div>
      {achievements.map((a,i) => <div key={i} className="achievement">
        <span className="achievement-icon">{a.icon}</span>
        <div className="flex-1"><div className="achievement-text">{a.text}</div><div className="achievement-time">{a.time}</div></div>
      </div>)}
    </div>
  </div>
}
