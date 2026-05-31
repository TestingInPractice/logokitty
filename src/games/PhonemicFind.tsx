import { useState, useCallback } from 'react'

const rounds = [
  { sound: 'С', cards: [{ emoji: '🐕', label: 'Собака', hasSound: true }, { emoji: '🐱', label: 'Кошка', hasSound: false }, { emoji: '🐘', label: 'Слон', hasSound: true }] },
  { sound: 'Ш', cards: [{ emoji: '🎩', label: 'Шляпа', hasSound: true }, { emoji: '🧦', label: 'Носки', hasSound: false }, { emoji: '🚗', label: 'Машина', hasSound: true }] },
  { sound: 'З', cards: [{ emoji: '🐰', label: 'Заяц', hasSound: true }, { emoji: '🌞', label: 'Солнце', hasSound: false }, { emoji: '🦷', label: 'Зубы', hasSound: true }] },
  { sound: 'Р', cards: [{ emoji: '🐟', label: 'Рыба', hasSound: true }, { emoji: '🐄', label: 'Корова', hasSound: false }, { emoji: '✏️', label: 'Карандаш', hasSound: true }] },
]

export default function PhonemicFind({ onComplete }: { onComplete: (ok: boolean) => void }) {
  const [roundIdx, setRoundIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [wins, setWins] = useState(0)

  const r = rounds[roundIdx % rounds.length]

  const handleClick = useCallback((card: typeof r.cards[0]) => {
    if (selected) return
    setSelected(card.label)
    if (card.hasSound) {
      setFeedback('correct')
      setTimeout(() => {
        const nw = wins + 1
        setWins(nw)
        if (nw >= 3) onComplete(true)
        else { setRoundIdx(i => i + 1); setSelected(null); setFeedback(null) }
      }, 800)
    } else {
      setFeedback('wrong')
      setTimeout(() => { setSelected(null); setFeedback(null) }, 800)
    }
  }, [selected, wins, onComplete])

  return (
    <div className="game-area">
      <div className="text-muted mb-8">
        Найди картинку со звуком <strong>{r.sound}</strong>
        {feedback === 'wrong' && <span style={{ color: 'red', marginLeft: 8 }}>❌ Попробуй ещё!</span>}
        {feedback === 'correct' && <span style={{ color: 'green', marginLeft: 8 }}>✅ Верно!</span>}
      </div>
      <div className="row justify-center" style={{ gap: 12, flexWrap: 'wrap' }}>
        {r.cards.map(c => (
          <button key={c.label} className="game-option" onClick={() => handleClick(c)}
            disabled={!!selected}
            style={{
              background: selected === c.label ? (c.hasSound ? '#e8f5e9' : '#ffebee') : undefined,
              transform: feedback === 'wrong' && selected === c.label ? 'scale(0.95)' : 'none',
              transition: 'all .2s',
            }}>
            <div style={{ fontSize: 40 }}>{c.emoji}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{c.label}</div>
          </button>
        ))}
      </div>
      <div className="text-muted mt-16" style={{ fontSize: 12 }}>
        {wins} / 3 правильных
      </div>
    </div>
  )
}
