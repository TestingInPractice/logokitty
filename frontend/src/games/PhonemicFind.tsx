import { useState, useCallback } from 'react'

const rounds = [
  { sound:'С', cards:[{emoji:'🐕',label:'Собака',hasSound:true},{emoji:'🐱',label:'Кошка',hasSound:false},{emoji:'🐘',label:'Слон',hasSound:true}] },
  { sound:'Ш', cards:[{emoji:'🎩',label:'Шляпа',hasSound:true},{emoji:'🧦',label:'Носки',hasSound:false},{emoji:'🚗',label:'Машина',hasSound:true}] },
  { sound:'З', cards:[{emoji:'🐰',label:'Заяц',hasSound:true},{emoji:'🌞',label:'Солнце',hasSound:false},{emoji:'🦷',label:'Зубы',hasSound:true}] },
  { sound:'Р', cards:[{emoji:'🐟',label:'Рыба',hasSound:true},{emoji:'🐄',label:'Корова',hasSound:false},{emoji:'✏️',label:'Карандаш',hasSound:true}] },
]

export default function PhonemicFind({ category, onComplete }: { category: string; onComplete: (ok: boolean) => void }) {
  const [ri,setRi] = useState(0); const [sel,setSel] = useState<string|null>(null)
  const [succ,setSucc] = useState(0); const [done,setDone] = useState(false)
  const r = rounds[ri % rounds.length]
  const h = useCallback((c: typeof r.cards[0]) => {
    if (sel) return
    setSel(c.label)
    setTimeout(() => {
      if (c.hasSound) {
        const ns = succ + 1
        setSucc(ns)
        if (ns >= 3) { setDone(true); onComplete(true) }
        else { setRi(i=>i+1); setSel(null) }
      } else { onComplete(false); setSel(null) }
    }, 800)
  }, [sel, succ, onComplete])

  if (done) return null
  return <div className="game-area">
    <div style={{fontSize:14,color:'var(--text-light)',marginBottom:8}}>
      Найди картинку со звуком <strong>{r.sound}</strong>
    </div>
    <div style={{fontSize:48,marginBottom:16}}>🔊</div>
    <div className="row justify-center" style={{gap:12,flexWrap:'wrap'}}>
      {r.cards.map(c => <button key={c.label} className="game-option" onClick={()=>h(c)}
        style={{cursor:sel?'default':'pointer',background:sel===c.label?(c.hasSound?'#e8f5e9':'#ffebee'):'var(--bg)'}} disabled={!!sel}>
        <div style={{fontSize:40}}>{c.emoji}</div>
        <div style={{fontSize:13,marginTop:4}}>{c.label}</div>
      </button>)}
    </div>
    <div className="text-muted mt-16" style={{fontSize:12}}>Раунд {Math.min(ri+1,3)}/{rounds.length}</div>
  </div>
}
