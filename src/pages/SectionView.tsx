import { useParams, useNavigate } from 'react-router-dom'
import { sections, games } from '../api/data'
import { useStore } from '../store/useStore'

const unlockLevelForStage = (stage: number) => stage === 1 ? 1 : (stage - 1) * 10 + 1

export default function SectionView() {
  const { id } = useParams()
  const n = useNavigate()
  const child = useStore(s => s.children.find(c => c.id === s.activeChildId))

  const section = sections.find(s => s.id === id)
  if (!section || !child) return <div className="page">Раздел не найден</div>

  const sectionGames = games.filter(g => g.section === id)
  const reqLevel = unlockLevelForStage(section.stageRequired)
  const isUnlocked = child.level >= reqLevel

  return (
    <div className="page">
      <div className="row-between mb-16">
        <button className="btn btn-sm btn-outline" onClick={() => n('/')}>← Назад</button>
        <span className={`badge ${isUnlocked ? 'badge-orange' : 'badge-muted'}`}>
          {isUnlocked ? '🔓 Открыт' : `🔒 Уровень ${reqLevel}`}
        </span>
      </div>
      <div className="text-center mb-16">
        <div style={{ fontSize: 40, marginBottom: 8 }}>{section.icon}</div>
        <div className="text-lg">{section.title}</div>
        <div className="text-muted">{section.description}</div>
      </div>

      {!isUnlocked && (
        <div className="card text-center" style={{ padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
          <div>Открывается на {reqLevel} уровне</div>
        </div>
      )}
      {isUnlocked && (
        <div className="section-grid">
          {sectionGames.map(g => {
            const gUnlocked = g.unlockLevel === null || child.level >= g.unlockLevel
            return (
              <button key={g.id} className="card" style={{ padding: 20, textAlign: 'center', cursor: gUnlocked ? 'pointer' : 'default' }}
                onClick={() => gUnlocked && n(`/game/${g.id}`)}>
                <div style={{ fontSize: 36, marginBottom: 4 }}>{g.category === 'phonemic' ? '🔊' : g.category === 'memory' ? '🧠' : g.category === 'logic' ? '🧩' : g.category === 'breathing' ? '💨' : g.category === 'vocabulary' ? '📖' : g.category === 'reading' ? '📚' : g.category === 'alphabet' ? '🔤' : g.category === 'tongue-twisters' ? '🗣️' : g.category === 'sonor' ? '🎵' : g.category === 'whistling' ? '😤' : g.category === 'articulation' ? '👄' : '🎯'}</div>
                <div className="mb-4">{g.title}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>{gUnlocked ? `+${g.expReward} EXP` : `🔒 Ур. ${g.unlockLevel}`}</div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
