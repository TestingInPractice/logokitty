import { levels } from '../api/data'

export default function LevelUpModal({ newLevel, onClose }: { newLevel: number; onClose: () => void }) {
  const d = levels.find(l => l.level === newLevel)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🎉</div>
        <div className="text-lg mb-8">Уровень {newLevel}!</div>
        {d?.rewardGold && <div style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 12 }}>+{d.rewardFood} 🐟 +{d.rewardGold} ⭐</div>}
        {d?.unlockSection && <div className="badge badge-gold" style={{ marginBottom: 12 }}>🎊 Новый раздел открыт!</div>}
        {d?.isStageComplete && <div className="text-muted" style={{ fontSize: 12, marginBottom: 12 }}>Этап завершён! Переход на следующий этап.</div>}
        <button className="btn btn-primary" onClick={onClose}>Ура!</button>
      </div>
    </div>
  )
}
