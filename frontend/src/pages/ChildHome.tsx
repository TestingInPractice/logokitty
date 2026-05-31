import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import CatMascot from '../components/CatMascot'
import CurrencyBar from '../components/CurrencyBar'
import LevelBar from '../components/LevelBar'
import SectionCard from '../components/SectionCard'
import { sections, levels } from '../api/db'

export default function ChildHome() {
  const n = useNavigate(); const child = useStore(s => s.children).find(c => c.id === useStore(s => s.activeChildId))
  if (!child) return null
  const stage = (levels.find(l => l.level === child.level) || levels[0]).stage
  const secs = sections.map(s => ({...s, isUnlocked: stage >= s.stageRequired}))
  return <div className="page">
    <div style={{textAlign:'center',marginBottom:16}}>
      <CatMascot size={80} />
      <div className="row-between mt-8">
        <div style={{width:80}}/>
        <div style={{flex:1,margin:'0 12px'}}><LevelBar /></div>
        <CurrencyBar />
      </div>
    </div>
    <div className="section-grid">{secs.map(s => <SectionCard key={s.id} section={s} onClick={()=>n(`/section/${s.id}`)}/>)}</div>
    <div className="row" style={{gap:12,justifyContent:'center'}}>
      <button className="btn btn-sm btn-outline" onClick={()=>n('/shop')}>🛍️ Магазин</button>
      <button className="btn btn-sm btn-outline" onClick={()=>n('/subscription')}>💎 Премиум</button>
    </div>
  </div>
}
