import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { db } from '../api/db'

export default function Settings() {
  const n = useNavigate()
  const children = useStore(s => s.children)
  const user = useStore(s => s.user)
  const cat = useStore(s => s.cat)

  const [debug, setDebug] = useState(false)
  const [dbDump, setDbDump] = useState<Record<string, unknown> | null>(null)

  const loadDbDump = async () => {
    const d = await (await import('idb')).openDB('logokitty', 1)
    const out: Record<string, unknown> = {}
    const stores = ['user', 'children', 'cats', 'inventory', 'sessions', 'soundProgress', 'diagnostics', 'subscriptions', 'settings']
    for (const s of stores) out[s] = await d.getAll(s)
    setDbDump(out)
  }

  const clearAll = async () => {
    if (!confirm('Удалить все данные?')) return
    indexedDB.deleteDatabase('logokitty')
    window.location.reload()
  }

  return (
    <div className="page">
      <button className="btn btn-sm btn-outline mb-16" onClick={() => n('/')}>← Назад</button>

      {user && (
        <div className="card row gap-12" style={{ padding: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {user.telegramAvatarUrl ? <img src={user.telegramAvatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: '50%' }} /> : '👤'}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div className="text-muted" style={{ fontSize: 11 }}>{user.id.slice(0, 8)}...</div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 16 }}>
        <div className="text-muted mb-8" style={{ fontWeight: 600, fontSize: 13 }}>Дети</div>
        {children.map(c => (
          <div key={c.id} className="row-between" style={{ padding: '6px 0' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>Ур. {c.level} • {c.exp} EXP</div>
            </div>
            <span className="badge badge-orange">{c.foodBalance} 🐟</span>
          </div>
        ))}
        {children.length === 0 && <div className="text-muted" style={{ fontSize: 12 }}>Нет детей</div>}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div className="row-between">
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Режим отладки</div>
            <div className="text-muted" style={{ fontSize: 11 }}>Просмотр данных БД</div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
            <input type="checkbox" checked={debug} onChange={() => { setDebug(d => !d); if (!debug) loadDbDump() }}
              style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: 'absolute', cursor: 'pointer', inset: 0, background: debug ? 'var(--orange)' : '#ccc',
              borderRadius: 24, transition: '.2s',
            }}>
              <span style={{
                position: 'absolute', height: 20, width: 20, left: debug ? 22 : 2, bottom: 2,
                background: '#fff', borderRadius: '50%', transition: '.2s',
              }} />
            </span>
          </label>
        </div>
      </div>

      {debug && dbDump && (
        <div className="card" style={{ padding: 16, overflow: 'auto', maxHeight: 400 }}>
          <pre style={{ fontSize: 10, whiteSpace: 'pre-wrap' }}>{JSON.stringify(dbDump, null, 2)}</pre>
        </div>
      )}

      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>О приложении</div>
        <div className="text-muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
          Logokitty v1.0.0 — логопедическое PWA для развития речи у детей 2-8 лет.
          Работает полностью offline. Данные хранятся локально на устройстве.
        </div>
      </div>

      <button className="btn btn-outline mt-16" style={{ borderColor: 'red', color: 'red' }} onClick={clearAll}>
        Сбросить все данные
      </button>
    </div>
  )
}
