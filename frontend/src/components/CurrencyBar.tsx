import { useStore } from '../store/useStore'
export default function CurrencyBar() {
  const child = useStore(s => s.children).find(c => c.id === useStore(s => s.activeChildId))
  if (!child) return null
  return <div className="currency-bar">
    <div className="currency-item">🐟 {child.foodBalance}</div>
    <div className="currency-item">⭐ {child.goldBalance}</div>
  </div>
}
