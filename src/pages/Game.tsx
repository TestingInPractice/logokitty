import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { games, calcLevel, levels } from '../api/data'
import { db } from '../api/db'
import PhonemicFind from '../games/PhonemicFind'
import MemoryMatch from '../games/MemoryMatch'
import LevelUpModal from '../components/LevelUpModal'

export default function Game() {
  const { id } = useParams()
  const n = useNavigate()
  const children = useStore(s => s.children)
  const activeChildId = useStore(s => s.activeChildId)
  const updateChild = useStore(s => s.updateChild)

  const [feedback, setFeedback] = useState<'win' | 'lose' | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [levelUp, setLevelUp] = useState<number | null>(null)

  const game = games.find(g => g.id === id)
  const child = children.find(c => c.id === activeChildId)

  if (!game || !activeChildId || !child) return <div className="page">Игра не найдена</div>

  const complete = (ok: boolean) => {
    if (gameOver) return
    if (ok) {
      setFeedback('win')
      setTimeout(async () => {
        let exp = child.exp + game.expReward
        let { level } = child
        let food = child.foodBalance + game.foodReward
        let gold = child.goldBalance

        const result = calcLevel(exp, level)
        if (result.leveledUp) {
          level = result.level
          exp = result.exp
          if (level % 5 === 0) gold += 10
        }

        updateChild(activeChildId, { exp, level, foodBalance: food, goldBalance: gold })
        await db.updateChild(activeChildId, { exp, level, foodBalance: food, goldBalance: gold })
        await db.addSession({
          id: db.generateId(), childId: activeChildId, gameId: game.id,
          score: game.expReward, expEarned: game.expReward, foodEarned: game.foodReward, completedAt: db.now(),
        })

        if (result.leveledUp) setLevelUp(level)
        else setGameOver(true)
      }, 1500)
    } else {
      setFeedback('lose')
      setTimeout(() => setFeedback(null), 1000)
    }
  }

  return (
    <div className="page">
      <div className="row-between mb-16">
        <button className="btn btn-sm btn-outline" onClick={() => n(`/section/${game.section}`)}>← Назад</button>
        <span className="badge badge-orange">+{game.expReward} EXP</span>
      </div>
      <div className="text-center mb-16">
        <div className="text-lg">{game.title}</div>
        <div className="text-muted">{game.description}</div>
      </div>

      {feedback === 'win' && (
        <div className="game-area" style={{ background: '#e8f5e9' }}>
          <div style={{ fontSize: 60 }}>🎉</div>
          <div className="text-lg">Молодец!</div>
          <div>+{game.expReward} EXP</div>
        </div>
      )}
      {feedback === 'lose' && (
        <div className="game-area" style={{ background: '#fff3e0' }}>
          <div style={{ fontSize: 60 }}>💪</div>
          <div className="text-lg">Попробуй ещё!</div>
        </div>
      )}
      {!feedback && (
        game.category === 'memory'
          ? <MemoryMatch onComplete={complete} />
          : <PhonemicFind onComplete={complete} />
      )}
      {gameOver && (
        <div className="card mt-16 text-center" style={{ padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <div className="text-lg mb-8">Игра пройдена!</div>
          <div className="row justify-center gap-16 mb-16">
            <div>+{game.expReward} EXP</div>
            <div>+{game.foodReward} 🐟</div>
          </div>
          <button className="btn btn-primary" onClick={() => n(`/section/${game.section}`)}>К играм</button>
        </div>
      )}
      {levelUp && <LevelUpModal newLevel={levelUp} onClose={() => { setLevelUp(null); setGameOver(true) }} />}
    </div>
  )
}
