import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { db } from '../api/db'

const COLORS = ['orange', 'gray', 'white', 'black', 'brown']
const COLOR_MAP: Record<string, string> = { orange: '#FF9E5E', gray: '#A0A0A0', white: '#F5F5F5', black: '#333', brown: '#8B6914' }

export default function ChildCreate() {
  const n = useNavigate()
  const user = useStore(s => s.user)
  const addChild = useStore(s => s.addChild)
  const setActiveChildId = useStore(s => s.setActiveChildId)
  const setCat = useStore(s => s.setCat)

  const [childName, setChildName] = useState('')
  const [age, setAge] = useState('3')
  const [catName, setCatName] = useState('')
  const [catColor, setCatColor] = useState('orange')

  const handleCreate = async () => {
    if (!childName.trim()) return
    const child: import('../types').Child = {
      id: db.generateId(), userId: user?.id ?? '', name: childName.trim(),
      age: parseInt(age) || 3, level: 1, exp: 0, foodBalance: 50, goldBalance: 0,
      lastDailyRewardAt: null, createdAt: db.now(),
    }
    const cat: import('../types').Cat = {
      id: db.generateId(), childId: child.id, name: catName.trim() || 'Коксик',
      color: catColor, equippedItems: [],
    }
    await db.addChild(child)
    await db.saveCat(cat)
    addChild(child)
    setActiveChildId(child.id)
    setCat(cat)
    n('/child')
  }

  return (
    <div className="page">
      <div className="text-center" style={{ paddingTop: 20 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🐱</div>
        <div className="text-lg">Создай профиль ребёнка</div>
        <div className="text-muted mt-8">Ребёнок будет заниматься с котиком</div>
      </div>

      <div className="card mt-16">
        <div className="col gap-16">
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 6 }}>Имя ребёнка</label>
            <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Миша"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '2px solid #f0e8e0', fontSize: 16, outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 6 }}>Возраст</label>
            <input type="number" min="2" max="8" value={age} onChange={e => setAge(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '2px solid #f0e8e0', fontSize: 16, outline: 'none' }} />
          </div>
        </div>
      </div>

      <div className="card mt-16">
        <div className="text-center mb-8" style={{ fontWeight: 600 }}>Котик</div>
        <div className="text-center mb-8" style={{ fontSize: 60 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: COLOR_MAP[catColor], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>😺</div>
        </div>
        <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Имя котика"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '2px solid #f0e8e0', fontSize: 16, outline: 'none', marginBottom: 12, textAlign: 'center' }} />
        <div className="flex gap-8 justify-center" style={{ flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => setCatColor(c)}
              style={{ width: 36, height: 36, borderRadius: '50%', border: catColor === c ? '3px solid var(--orange)' : '3px solid transparent', background: COLOR_MAP[c] }} />
          ))}
        </div>
      </div>

      <button className="btn btn-primary mt-16" onClick={handleCreate}>Начать заниматься!</button>
    </div>
  )
}
