import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { db } from '../api/db'
import type { GameSession } from '../types'

export default function Feed() {
  const n = useNavigate()
  const children = useStore(s => s.children)
  const activeChildId = useStore(s => s.activeChildId)
  const updateChild = useStore(s => s.updateChild)
  const child = children.find(c => c.id === activeChildId)

  const [sessions, setSessions] = useState<GameSession[]>([])
  const [dailyClaimed, setDailyClaimed] = useState(false)

  useEffect(() => {
    if (children.length === 0) n('/child/create')
  }, [children, n])

  useEffect(() => {
    if (activeChildId) {
      db.getSessions(activeChildId).then(s => setSessions(s.slice(-10).reverse()))
      const c = children.find(x => x.id === activeChildId)
      if (c) setDailyClaimed(!db.canClaimDaily(c))
    }
  }, [activeChildId, children])

  if (children.length === 0) return null

  const claimDaily = async () => {
    if (!activeChildId || !child) return
    const updated = db.claimDaily(child)
    updateChild(activeChildId, { foodBalance: updated.foodBalance, lastDailyRewardAt: updated.lastDailyRewardAt })
    await db.updateChild(activeChildId, { foodBalance: updated.foodBalance, lastDailyRewardAt: updated.lastDailyRewardAt })
    setDailyClaimed(true)
  }

  return (
    <div className="page">
      <div className="text-lg mb-16">Лента</div>

      <div className="card text-center" style={{ padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{dailyClaimed ? '✅' : '🎁'}</div>
        <div className="mb-8">{dailyClaimed ? 'Награда получена!' : 'Ежедневная награда'}</div>
        <div className="text-muted mb-8">+50 🐟</div>
        {!dailyClaimed && <button className="btn btn-primary" onClick={claimDaily}>Забрать</button>}
      </div>

      {activeChildId && children.filter(c => c.id !== activeChildId).length > 0 && (
        <div className="card" style={{ padding: 16 }}>
          <div className="text-muted mb-8" style={{ fontSize: 13, fontWeight: 600 }}>Другие дети</div>
          {children.filter(c => c.id !== activeChildId).map(c => (
            <div key={c.id} className="row-between" style={{ padding: '8px 0', cursor: 'pointer' }}
              onClick={() => { useStore.getState().setActiveChildId(c.id); n('/child') }}>
              <div>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>Ур. {c.level}</div>
              </div>
              <span style={{ fontSize: 20 }}>🐱</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16">
        <div className="text-muted mb-8" style={{ fontSize: 13, fontWeight: 600 }}>Последние игры</div>
        {sessions.length === 0 && <div className="card text-center" style={{ padding: 24, color: 'var(--text-light)' }}>Игр пока нет</div>}
        {sessions.map(s => (
          <div key={s.id} className="card" style={{ padding: 12 }}>
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.gameId}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {new Date(s.completedAt).toLocaleDateString('ru-RU')} • {new Date(s.completedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="row gap-8">
                <span className="badge badge-orange">+{s.expEarned}</span>
                <span className="badge badge-green">+{s.foodEarned}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
