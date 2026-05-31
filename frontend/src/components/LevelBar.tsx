import { useStore } from '../store/useStore'
import { levels } from '../api/db'
export default function LevelBar() {
  const ch = useStore(s => s.children).find(c => c.id === useStore(s => s.activeChildId))
  if (!ch) return null
  const cur = levels.find(l => l.level === ch.level) || levels[0]
  const nxt = levels.find(l => l.level === ch.level + 1)
  const exp = nxt ? nxt.expRequired : cur.expRequired
  return <div className="col" style={{gap:4}}>
    <div className="row-between"><span style={{fontWeight:700,fontSize:14}}>Уровень {ch.level}</span><span className="text-muted">{ch.exp}/{exp} EXP</span></div>
    <div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(ch.exp/exp*100,100)}%`}}/></div>
  </div>
}
