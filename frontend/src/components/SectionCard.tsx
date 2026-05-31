import type { Section } from '../types'
export default function SectionCard({ section, onClick }: { section: Section; onClick: () => void }) {
  return <button onClick={section.isUnlocked ? onClick : undefined} style={{
    background: section.isUnlocked ? 'linear-gradient(135deg,var(--orange),var(--pink))' : '#e0e0e0',
    borderRadius:'var(--radius)', padding:20, textAlign:'center', opacity:section.isUnlocked?1:.6,
    boxShadow:section.isUnlocked?'0 4px 16px rgba(255,158,94,.3)':'none',
    border:'none', cursor:section.isUnlocked?'pointer':'default', minHeight:140,
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8,
  }}>
    <span style={{fontSize:40}}>{section.icon}</span>
    <span style={{fontWeight:700,fontSize:14,color:section.isUnlocked?'#fff':'var(--text-light)'}}>{section.title}</span>
    <span style={{fontSize:11,color:section.isUnlocked?'rgba(255,255,255,.8)':'var(--text-light)'}}>{section.description}</span>
    {!section.isUnlocked && <span className="badge badge-gold" style={{marginTop:4}}>🔒 Уровень {section.stageRequired*10}</span>}
  </button>
}
