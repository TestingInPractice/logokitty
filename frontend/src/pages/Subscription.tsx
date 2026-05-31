export default function Subscription() {
  const plans = [
    { name:'1 месяц', price:890, period:'в месяц', popular:false },
    { name:'3 месяца', price:1650, period:'за 3 месяца', popular:true },
    { name:'1 год', price:2890, period:'в год', popular:false, badge:'🔥 Выгода 73%' },
  ]
  return <div className="page">
    <div className="text-center mb-16"><div style={{fontSize:48,marginBottom:8}}>💎</div><div className="text-lg">Премиум</div>
      <div className="text-muted mt-8">Полный доступ ко всем разделам, играм и диагностике</div></div>
    {plans.map(p => <div key={p.name} className={`plan-card mb-8 ${p.popular?'popular':''}`}>
      {p.badge && <span className="badge badge-gold" style={{marginBottom:8}}>{p.badge}</span>}
      <div className="plan-price">{p.price} ₽</div>
      <div className="plan-period">{p.period}</div>
      <div style={{marginTop:8,fontSize:13,color:'var(--text-light)'}}>
        {p.name === '1 месяц' && 'Все разделы, игры, диагностика'}
        {p.name === '3 месяца' && 'Всё включено + приоритетная поддержка'}
        {p.name === '1 год' && 'Максимальная выгода + все обновления'}
      </div>
      <button className={`btn mt-8 ${p.popular?'btn-primary':'btn-outline'}`}>{p.popular?'🔥 Выбрать':'Выбрать'}</button>
    </div>)}
    <div className="card text-center" style={{marginTop:16}}><div className="text-muted" style={{fontSize:12}}>Оплата через YooKassa. Безопасно и надёжно.</div></div>
  </div>
}
