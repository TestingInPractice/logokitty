import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Feed() {
  const n = useNavigate()
  const children = useStore(s => s.children)

  useEffect(() => {
    if (children.length === 0) n('/child/create')
  }, [children, n])

  if (children.length === 0) return null

  return (
    <div className="page">
      <div className="text-lg mb-16">Лента</div>
      {children.map(c => (
        <div key={c.id} className="card" style={{ cursor: 'pointer' }}
          onClick={() => { useStore.getState().setActiveChildId(c.id); n('/child') }}>
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div className="text-muted">{c.age} года • Уровень {c.level}</div>
            </div>
            <span style={{ fontSize: 24 }}>🐱</span>
          </div>
        </div>
      ))}
    </div>
  )
}
