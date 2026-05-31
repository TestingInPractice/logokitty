import { useStore } from '../store/useStore'
const colors: Record<string,string> = { orange:'#FF9E5E', gray:'#A0A0A0', white:'#F5F5F5', black:'#333', brown:'#8B6914' }
export default function CatMascot({ size=80 }: { size?: number }) {
  const cat = useStore(s => s.cat)
  if (!cat) return null
  const bg = colors[cat.color] || colors.orange
  return <div className="cat-mascot">
    <div className="cat-face" style={{ width:size, height:size, background:bg, boxShadow:`0 4px 12px ${bg}66` }}><span style={{fontSize:size*.45}}>😺</span></div>
    <span className="cat-name">{cat.name}</span>
  </div>
}
