import type { ShopItem } from '../types'
const catLabels: Record<string,string> = { hat:'Шапка', glasses:'Очки', scarf:'Аксессуар', house:'Домик', background:'Фон' }
export default function ShopItemCard({ item, owned, equipped, canBuy, onBuy, onEquip }: { item:ShopItem; owned:boolean; equipped:boolean; canBuy:boolean; onBuy:()=>void; onEquip:()=>void }) {
  return <div className="card" style={{textAlign:'center',padding:16}}>
    <div style={{fontSize:40,marginBottom:8}}>{item.previewUrl}</div>
    <div style={{fontWeight:600,fontSize:14}}>{item.name}</div>
    <div style={{fontSize:11,color:'var(--text-light)',marginTop:4}}>{catLabels[item.category]}</div>
    {item.isPremium && <div className="badge badge-gold" style={{margin:'6px 0'}}>💎 Премиум</div>}
    <div style={{marginTop:8}}>
      {equipped ? <span className="badge badge-green">Надето</span>
      : owned ? <button className="btn btn-sm btn-outline" onClick={onEquip}>Надеть</button>
      : <button className={`btn btn-sm ${canBuy?'btn-primary':''}`} onClick={canBuy?onBuy:undefined} disabled={!canBuy}
          style={!canBuy?{background:'#e0e0e0',color:'#999'}:{}}>
          {item.priceFood ? `🐟 ${item.priceFood}` : ''} {item.priceGold ? `⭐ ${item.priceGold}` : ''}
          {item.levelRequirement ? ` (ур. ${item.levelRequirement})` : ''}
        </button>}
    </div>
  </div>
}
