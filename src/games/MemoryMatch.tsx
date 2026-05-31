import { useState, useEffect, useCallback } from 'react'

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean }

function shuffle<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] }
  return r
}

export default function MemoryMatch({ onComplete }: { onComplete: (ok: boolean) => void }) {
  const [cards, setCards] = useState<Card[]>(() => shuffle(
    ['🐱', '🐟', '⭐', '🎮'].flatMap((e, i) => [{ id: i * 2, emoji: e, flipped: false, matched: false }, { id: i * 2 + 1, emoji: e, flipped: false, matched: false }])
  ))
  const [flipIds, setFlipIds] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)

  const flip = useCallback((id: number) => {
    if (locked) return
    setCards(p => p.map(c => c.id === id ? { ...c, flipped: true } : c))
    setFlipIds(p => [...p, id])
  }, [locked])

  useEffect(() => {
    if (flipIds.length !== 2) return
    setLocked(true)
    setMoves(m => m + 1)
    const [a, b] = flipIds
    const c1 = cards.find(c => c.id === a)
    const c2 = cards.find(c => c.id === b)
    if (c1 && c2 && c1.emoji === c2.emoji) {
      setTimeout(() => {
        setCards(p => p.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c))
        setFlipIds([])
        setLocked(false)
      }, 500)
    } else {
      setTimeout(() => {
        setCards(p => p.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c))
        setFlipIds([])
        setLocked(false)
      }, 1000)
    }
  }, [flipIds, cards])

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setTimeout(() => onComplete(true), 500)
    }
  }, [cards, onComplete])

  return (
    <div className="game-area">
      <div className="row-between w-full mb-8">
        <div className="text-muted" style={{ fontSize: 12 }}>Ходов: {moves}</div>
        <div className="text-muted" style={{ fontSize: 12 }}>{cards.filter(c => c.matched).length / 2}/{cards.length / 2} пар</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: '100%', maxWidth: 280 }}>
        {cards.map(c => (
          <button key={c.id} onClick={() => flip(c.id)}
            style={{
              aspectRatio: 1, borderRadius: 'var(--radius-sm)', border: '2px solid #f0e8e0',
              background: c.flipped || c.matched ? '#fff' : 'var(--orange-light)',
              fontSize: c.flipped || c.matched ? 28 : 0, cursor: c.flipped || c.matched || locked ? 'default' : 'pointer',
              transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            {(c.flipped || c.matched) ? c.emoji : '❓'}
          </button>
        ))}
      </div>
    </div>
  )
}
