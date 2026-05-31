import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { sections, levels } from '../api/db'
import GameTile from '../components/GameTile'

export default function SectionView() {
  const { id } = useParams(); const n = useNavigate()
  const child = useStore(s => s.children).find(c => c.id === useStore(s => s.activeChildId))
  if (!child || !id) return null
  const sec = sections.find(s => s.id === id)
  if (!sec) return <div className="page">Раздел не найден</div>
  const curLevel = (levels.find(l => l.level === child.level) || levels[0]).level
  const games = sec.games.filter(g => !g.unlockLevel || curLevel >= g.unlockLevel)
  return <div className="page">
    <div style={{textAlign:'center',marginBottom:16}}>
      <div style={{fontSize:48,marginBottom:4}}>{sec.icon}</div>
      <div className="text-lg">{sec.title}</div>
      <div className="text-muted">{sec.description}</div>
    </div>
    <div className="game-grid">{games.map(g => <GameTile key={g.id} game={g} onClick={()=>n(`/game/${g.id}`)}/>)}</div>
    {games.length === 0 && <div className="card text-center" style={{padding:32}}>
      <div style={{fontSize:40,marginBottom:8}}>🔒</div>
      <div className="text-muted">Нет доступных игр</div>
      <div className="text-muted" style={{fontSize:12}}>Достигните уровня {Math.min(...sec.games.map(g=>g.unlockLevel||99))} чтобы открыть игры</div>
    </div>}
  </div>
}
