import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const COLOR_MAP: Record<string, string> = { orange: '#FF9E5E', gray: '#A0A0A0', white: '#F5F5F5', black: '#333', brown: '#8B6914' }

export default function ChildHome() {
  const n = useNavigate()
  const activeChildId = useStore(s => s.activeChildId)
  const child = useStore(s => s.children).find(c => c.id === activeChildId)
  const cat = useStore(s => s.cat)

  if (!child) return <div className="page"><button className="btn btn-primary" onClick={() => n('/child/create')}>Создать ребёнка</button></div>

  const bg = COLOR_MAP[cat?.color ?? 'orange']

  return (
    <div className="page">
      <div className="text-center" style={{ marginBottom: 24 }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: `0 4px 16px ${bg}66` }}>
          😺
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>{cat?.name}</div>
        <div className="row justify-center gap-8 mt-8">
          <span className="badge badge-orange">🐟 {child.foodBalance}</span>
          <span className="badge badge-gold">⭐ {child.goldBalance}</span>
        </div>
        <div className="text-muted mt-8">Уровень {child.level} • {child.exp} EXP</div>
      </div>

      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Разделы</div>
      <div className="col gap-12">
        <SectionButton icon="🗣️" title="Запуск речи" desc="Артикуляция, выдох, первые звуки" onClick={() => n('/section/speech-launch')} />
        <SectionButton icon="📢" title="Развитие речи" desc="Свистящие, шипящие, сонорные" locked stageRequired={2} childStage={Math.ceil(child.level / 10)} onClick={() => {}} />
        <SectionButton icon="🧩" title="Развивающие игры" desc="Логика, внимание, память" locked stageRequired={3} childStage={Math.ceil(child.level / 10)} onClick={() => {}} />
        <SectionButton icon="📚" title="Подготовка к школе" desc="Алфавит, счёт, чтение" locked stageRequired={4} childStage={Math.ceil(child.level / 10)} onClick={() => {}} />
      </div>
    </div>
  )
}

function SectionButton({ icon, title, desc, locked, stageRequired, childStage, onClick }: {
  icon: string; title: string; desc: string; locked?: boolean; stageRequired?: number; childStage?: number; onClick: () => void
}) {
  if (locked && (childStage ?? 0) < (stageRequired ?? 0)) {
    return (
      <div className="card" style={{ opacity: 0.6, textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>{icon}</div>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div className="text-muted" style={{ fontSize: 12 }}>{desc}</div>
        <span className="badge badge-gold" style={{ marginTop: 8 }}>🔒 Откроется на {stageRequired}0 уровне</span>
      </div>
    )
  }
  return (
    <button className="card" onClick={onClick} style={{ textAlign: 'center', padding: 20, cursor: 'pointer', border: 'none', width: '100%' }}>
      <div style={{ fontSize: 36, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div className="text-muted" style={{ fontSize: 12 }}>{desc}</div>
    </button>
  )
}
