import type { Game } from '../types'
const icons: Record<string,string> = { phonemic:'🔊', articulation:'🗣️', breathing:'💨', whistling:'🎵', 'tongue-twisters':'🌀', memory:'🧠', logic:'🧩', alphabet:'🔤', syllable:'📝', vocabulary:'📖' }
export default function GameTile({ game, onClick }: { game: Game; onClick: () => void }) {
  return <button onClick={onClick} style={{background:'var(--bg)',borderRadius:'var(--radius-sm)',padding:14,textAlign:'center',border:'2px solid transparent',cursor:'pointer',transition:'border-color .15s'}}>
    <div style={{fontSize:28,marginBottom:6}}>{icons[game.category]||'🎮'}</div>
    <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{game.title}</div>
    <div style={{fontSize:11,color:'var(--text-light)'}}>+{game.expReward} EXP</div>
    {game.requiresSubscription && <div className="badge badge-gold" style={{marginTop:6,fontSize:10}}>🔒 Премиум</div>}
  </button>
}
