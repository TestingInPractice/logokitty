import { useStore } from '../store/useStore'
import { db } from '../api/db'

export default function DailyReward() {
  const claimed = useStore(s => s.dailyClaimed)
  const id = useStore(s => s.activeChildId)
  const upd = useStore(s => s.updateChild)
  const setDailyClaimed = useStore(s => s.setDailyClaimed)
  const handle = () => {
    if (!id || claimed) return
    if (db.claimDaily(id)) {
      setDailyClaimed(true)
      const c = useStore.getState().children.find(x => x.id === id)
      if (c) upd(id, { foodBalance: c.foodBalance + 50, lastDailyRewardAt: Date.now() })
    }
  }
  return (
    <div className="reward-card">
      <div className="reward-amount">+50 🐟</div>
      <div className="reward-label">Ежедневный бонус</div>
      <button className="btn btn-sm" onClick={handle} disabled={claimed}
        style={{ marginTop: 12, background: claimed ? '#999' : '#333', color: '#fff', width: 'auto' }}>
        {claimed ? 'Уже забрали' : 'Забрать'}
      </button>
    </div>
  )
}
