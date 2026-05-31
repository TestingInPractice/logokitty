import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { games, db } from '../api/db'
import PhonemicFind from '../games/PhonemicFind'
import MemoryMatch from '../games/MemoryMatch'
import LevelUpModal from '../components/LevelUpModal'

export default function Game() {
  const { id } = useParams(); const n = useNavigate()
  const children = useStore(s => s.children); const aid = useStore(s => s.activeChildId)
  const upd = useStore(s => s.updateChild)
  const [score,setScore] = useState(0); const [gameOver,setGO] = useState(false)
  const [levelUp,setLU] = useState<number|null>(null); const [fb,setFB] = useState<'win'|'lose'|null>(null)
  const game = games.find(g => g.id === id); const child = children.find(c => c.id === aid)
  if (!game || !aid || !child) return null

  const complete = (ok: boolean) => {
    if (gameOver) return
    if (ok) {
      setScore(game.expReward); setFB('win')
      setTimeout(() => {
        let exp = child.exp + game.expReward, lvl = child.level, food = child.foodBalance + game.foodReward, gold = child.goldBalance
        let showLU = false
        while (exp >= lvl * 100) { exp -= lvl * 100; lvl++; if (lvl % 5 === 0) gold += 10; showLU = true }
        upd(aid, { exp, level: lvl, foodBalance: food, goldBalance: gold })
        db.addSession({ id:crypto.randomUUID(), childId:aid, gameId:game.id, score:game.expReward, expEarned:game.expReward, foodEarned:game.foodReward, completedAt:Date.now() })
        showLU ? setLU(lvl) : setGO(true)
      }, 1500)
    } else { setFB('lose'); setTimeout(() => setFB(null), 1000) }
  }

  return <div className="page">
    <div className="row-between mb-16">
      <button className="btn btn-sm btn-outline" onClick={()=>n(`/section/${game.section}`)}>← Назад</button>
      <span className="badge badge-orange">+{game.expReward} EXP</span>
    </div>
    <div className="text-center mb-16"><div className="text-lg">{game.title}</div><div className="text-muted">{game.description}</div></div>
    {fb === 'win' && <div className="game-area" style={{background:'#e8f5e9'}}><div style={{fontSize:60}}>🎉</div><div className="text-lg">Молодец!</div><div>+{score} EXP</div></div>}
    {fb === 'lose' && <div className="game-area" style={{background:'#fff3e0'}}><div style={{fontSize:60}}>💪</div><div className="text-lg">Попробуй ещё!</div></div>}
    {!fb && (game.category === 'memory' ? <MemoryMatch onComplete={complete}/> : <PhonemicFind category={game.category} onComplete={complete}/>)}
    {gameOver && <div className="card mt-16 text-center" style={{padding:24}}>
      <div style={{fontSize:48,marginBottom:8}}>🏆</div>
      <div className="text-lg mb-8">Игра пройдена!</div>
      <div className="row justify-center gap-16 mb-16"><div>+{game.expReward} EXP</div><div>+{game.foodReward} 🐟</div></div>
      <button className="btn btn-primary" onClick={()=>n(`/section/${game.section}`)}>К играм</button>
    </div>}
    {levelUp && <LevelUpModal newLevel={levelUp} onClose={()=>{setLU(null);setGO(true)}}/>}
  </div>
}
