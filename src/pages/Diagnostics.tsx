import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { db } from '../api/db'

const SOUNDS_TO_TEST = ['А', 'О', 'У', 'М', 'П', 'Б', 'С', 'З', 'Ш', 'Ж', 'Л', 'Р']

export default function Diagnostics() {
  const n = useNavigate()
  const child = useStore(s => s.children.find(c => c.id === s.activeChildId))
  const activeChildId = useStore(s => s.activeChildId)
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<Array<{ sound: string; ok: boolean }>>([])
  const [phase, setPhase] = useState<'intro' | 'testing' | 'done'>('intro')

  if (!child || !activeChildId) return <div className="page">Загрузка...</div>

  const sound = SOUNDS_TO_TEST[idx]

  const pass = (ok: boolean) => {
    const nr = [...results, { sound, ok }]
    setResults(nr)
    if (idx + 1 >= SOUNDS_TO_TEST.length) {
      setPhase('done')
      const okCount = nr.filter(r => r.ok).length
      const accuracy = Math.round((okCount / nr.length) * 100)
      db.addSession({
        id: db.generateId(), childId: activeChildId, gameId: 'diagnostics',
        score: okCount, expEarned: okCount * 10, foodEarned: 0, completedAt: db.now(),
      })
    } else {
      setIdx(i => i + 1)
    }
  }

  return (
    <div className="page">
      <button className="btn btn-sm btn-outline mb-16" onClick={() => n('/')}>← Назад</button>

      {phase === 'intro' && (
        <div className="card text-center" style={{ padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🩺</div>
          <div className="text-lg mb-8">Проверка слуха и произношения</div>
          <div className="text-muted mb-16">
            Сейчас котик будет произносить звуки, а ты повторяй.
            Мы переведём твою речь в текст и проверим, всё ли верно.
          </div>
          <button className="btn btn-primary" onClick={() => setPhase('testing')}>Начать</button>
        </div>
      )}

      {phase === 'testing' && (
        <div className="card text-center" style={{ padding: 24 }}>
          <div className="text-muted mb-16" style={{ fontSize: 12 }}>Звук {idx + 1} из {SOUNDS_TO_TEST.length}</div>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔊</div>
          <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 24, color: 'var(--orange-dark)' }}>
            {sound}
          </div>
          <div className="row justify-center gap-16" style={{ marginTop: 16 }}>
            <button className="btn btn-outline" style={{ width: 100 }} onClick={() => pass(false)}>Неверно ❌</button>
            <button className="btn btn-primary" style={{ width: 100 }} onClick={() => pass(true)}>Верно ✅</button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="card text-center" style={{ padding: 24 }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>🎉</div>
          <div className="text-lg mb-8">Готово!</div>
          <div className="mb-16">
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--orange-dark)' }}>
              {Math.round((results.filter(r => r.ok).length / results.length) * 100)}%
            </div>
            <div className="text-muted">правильных ответов</div>
          </div>
          <div className="col mb-16" style={{ gap: 4 }}>
            {results.map(r => (
              <div key={r.sound} className="row-between" style={{ padding: '4px 0' }}>
                <span style={{ fontWeight: 600 }}>Звук {r.sound}</span>
                <span>{r.ok ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
          <div className="row justify-center gap-12">
            <button className="btn btn-sm btn-outline" onClick={() => n('/')}>На главную</button>
            <button className="btn btn-sm btn-primary" onClick={() => { setIdx(0); setResults([]); setPhase('intro') }}>Заново</button>
          </div>
        </div>
      )}
    </div>
  )
}
