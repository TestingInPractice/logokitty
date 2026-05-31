import { useState } from 'react'
import { useStore } from '../store/useStore'
import { shopItems, db } from '../api/db'
import ShopItemCard from '../components/ShopItemCard'

export default function Shop() {
  const children = useStore(s => s.children); const id = useStore(s => s.activeChildId)
  const upd = useStore(s => s.updateChild); const [cat,setCat] = useState('all')
  const child = children.find(c => c.id === id)
  if (!child) return null
  const inv = db.getInventory(child.id).map(i => i.itemId)
  const cats = ['all','hat','glasses','scarf','house','background']
  const labels: Record<string,string> = { all:'Всё', hat:'Шапки', glasses:'Очки', scarf:'Аксессуары', house:'Домики', background:'Фоны' }
  const items = cat === 'all' ? shopItems : shopItems.filter(i => i.category === cat)
  const buy = (item: typeof shopItems[0]) => {
    if (!id) return
    if (item.priceFood && child.foodBalance >= item.priceFood) {
      db.addToInventory({ id:crypto.randomUUID(), childId:id, itemId:item.id, purchasedAt:Date.now() })
      upd(id, { foodBalance: child.foodBalance - item.priceFood })
    } else if (item.priceGold && child.goldBalance >= item.priceGold) {
      db.addToInventory({ id:crypto.randomUUID(), childId:id, itemId:item.id, purchasedAt:Date.now() })
      upd(id, { goldBalance: child.goldBalance - item.priceGold })
    }
  }
  return <div className="page">
    <div className="text-center mb-8">
      <div className="text-lg">🛍️ Магазин</div>
      <div className="row justify-center gap-8 mt-8">
        <span className="badge badge-green">🐟 {child.foodBalance}</span>
        <span className="badge badge-gold">⭐ {child.goldBalance}</span>
      </div>
    </div>
    <div className="tabs">{cats.map(c => <button key={c} className={`tab ${cat===c?'active':''}`} onClick={()=>setCat(c)}>{labels[c]}</button>)}</div>
    <div className="shop-grid">{items.map(i => <ShopItemCard key={i.id} item={i} owned={inv.includes(i.id)} equipped={false}
      canBuy={(!i.priceFood||child.foodBalance>=i.priceFood)&&(!i.priceGold||child.goldBalance>=i.priceGold)&&(!i.levelRequirement||child.level>=i.levelRequirement)&&!i.isPremium}
      onBuy={()=>buy(i)} onEquip={()=>{}}/>)}</div>
  </div>
}
