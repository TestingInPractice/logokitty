import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { shopItems } from '../api/data'
import { db } from '../api/db'
import { useStore } from '../store/useStore'
import type { ShopCategory, Inventory } from '../types'

const tabs: ShopCategory[] = ['hat', 'glasses', 'scarf', 'house', 'background']
const tabIcons: Record<ShopCategory, string> = { hat: '🧢', glasses: '👓', scarf: '🧣', house: '🏠', background: '🌲' }

export default function Shop() {
  const n = useNavigate()
  const child = useStore(s => s.children.find(c => c.id === s.activeChildId))
  const cat = useStore(s => s.cat)
  const children = useStore(s => s.children)
  const activeChildId = useStore(s => s.activeChildId)
  const updateChild = useStore(s => s.updateChild)

  const [inv, setInv] = useState<Inventory[]>([])
  const [tab, setTab] = useState<ShopCategory>('hat')
  const [msg, setMsg] = useState('')

  useEffect(() => { if (activeChildId) db.getInventory(activeChildId).then(setInv) }, [activeChildId])

  if (!child || !cat || !activeChildId) return <div className="page">Загрузка...</div>

  const items = shopItems.filter(i => i.category === tab)
  const owned = (id: string) => inv.some(i => i.itemId === id)
  const equipped = (id: string) => cat.equippedItems.includes(id)

  const buy = async (item: typeof shopItems[0]) => {
    if (item.priceFood && child.foodBalance < item.priceFood) { setMsg('Не хватает 🐟'); return }
    if (item.priceGold && child.goldBalance < item.priceGold) { setMsg('Не хватает 🪙'); return }
    if (item.levelRequirement && child.level < item.levelRequirement) { setMsg(`Нужен ${item.levelRequirement} уровень`); return }

    const food = item.priceFood ? child.foodBalance - item.priceFood : child.foodBalance
    const gold = item.priceGold ? child.goldBalance - item.priceGold : child.goldBalance

    await db.addToInventory({ id: db.generateId(), childId: activeChildId, itemId: item.id, purchasedAt: db.now() })
    updateChild(activeChildId, { foodBalance: food, goldBalance: gold })
    setInv(p => [...p, { id: '', childId: activeChildId, itemId: item.id, purchasedAt: 0 }])
    setMsg(`Куплено! ${item.name}`)
  }

  const toggleEquip = async (itemId: string) => {
    const equipped = cat.equippedItems.includes(itemId)
    const newEq = equipped ? cat.equippedItems.filter(i => i !== itemId) : [...cat.equippedItems, itemId]
    useStore.getState().setCat({ ...cat, equippedItems: newEq })
    await db.saveCat({ ...cat, equippedItems: newEq })
    setMsg(equipped ? 'Снято' : 'Надето')
  }

  return (
    <div className="page">
      <div className="row-between mb-16">
        <button className="btn btn-sm btn-outline" onClick={() => n('/')}>← Назад</button>
        <div className="row" style={{ gap: 12 }}>
          <span className="badge badge-gold">🪙 {child.goldBalance}</span>
          <span className="badge badge-green">🐟 {child.foodBalance}</span>
        </div>
      </div>
      <div className="text-center mb-16">
        <div style={{ fontSize: 40, marginBottom: 4 }}>{cat.color === 'orange' ? '🐱' : cat.color === 'white' ? '🐱' : cat.color === 'black' ? '🐈‍⬛' : '🐱'}</div>
        <div className="text-lg mb-4">{cat.name}</div>
        <div className="text-muted" style={{ fontSize: 12 }}>
          {cat.equippedItems.map(e => shopItems.find(i => i.id === e)?.name).filter(Boolean).join(', ') || 'Без аксессуаров'}
        </div>
      </div>

      {msg && (
        <div className="card text-center" style={{ padding: 12, background: '#e8f5e9', marginBottom: 12 }}>
          <div style={{ fontSize: 14 }}>{msg}</div>
          <button onClick={() => setMsg('')} style={{ background: 'none', color: 'var(--text-light)', fontSize: 12, marginTop: 4 }}>ОК</button>
        </div>
      )}

      <div className="row mb-16" style={{ gap: 4, overflow: 'auto', justifyContent: 'center' }}>
        {tabs.map(t => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t)} style={{ padding: '8px 14px', fontSize: 13 }}>
            {tabIcons[t]} {t === 'hat' ? 'Шапки' : t === 'glasses' ? 'Очки' : t === 'scarf' ? 'Шарфы' : t === 'house' ? 'Домики' : 'Фоны'}
          </button>
        ))}
      </div>

      <div className="section-grid">
        {items.map(item => {
          const isOwned = owned(item.id)
          const isEquipped = equipped(item.id)
          return (
            <div key={item.id} className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 4 }}>{item.previewUrl}</div>
              <div className="mb-4" style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
              <div className="text-muted mb-8" style={{ fontSize: 11 }}>
                {item.priceFood ? `🐟 ${item.priceFood}` : ''}
                {item.priceGold ? `🪙 ${item.priceGold}` : ''}
                {item.isPremium ? ' ⭐' : ''}
              </div>
              {isOwned ? (
                <button className={`btn btn-sm ${isEquipped ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => toggleEquip(item.id)} style={{ width: '100%', padding: '6px 12px', fontSize: 12 }}>
                  {isEquipped ? 'Снять' : 'Надеть'}
                </button>
              ) : (
                <button className="btn btn-sm btn-primary" onClick={() => buy(item)}
                  disabled={item.isPremium || (item.priceFood !== null && child.foodBalance < item.priceFood) || (item.priceGold !== null && child.goldBalance < item.priceGold)}
                  style={{ width: '100%', padding: '6px 12px', fontSize: 12, opacity: item.isPremium ? 0.5 : 1 }}>
                  {item.isPremium ? 'Премиум' : 'Купить'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
