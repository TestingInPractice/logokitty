import { useStore } from '../store/useStore'
import { levels } from '../api/data'

export default function LevelBar() {
  const child = useStore(s => s.children).find(c => c.id === useStore(s => s.activeChildId))
  if (!child) return null
  const cur = levels.find(l => l.level === child.level) ?? levels[0]
  const nxt = levels.find(l => l.level === Math.min(child.level + 1, 50))
  const exp = nxt ? nxt.expRequired : cur.expRequired
  const pct = Math.min(child.exp / exp * 100, 100)

  return (
    <div className="col" style={{ gap: 4 }}>
      <div className="row-between">
        <span style={{ fontWeight: 700, fontSize: 14 }}>Уровень {child.level}</span>
        <span className="text-muted">{child.exp}/{exp} EXP</span>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
    </div>
  )
}
