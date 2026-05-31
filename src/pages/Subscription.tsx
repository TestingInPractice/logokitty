import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { db } from '../api/db'

const plans = [
  { id: 'monthly', name: 'Premium на месяц', price: '299 ₽/мес', features: ['Все игры без ограничений', 'Эксклюзивные аксессуары', 'Подробная статистика', 'Без рекламы'], popular: true },
  { id: 'yearly', name: 'Premium на год', price: '1 990 ₽/год', features: ['Всё из месячного плана', 'Скидка 44%', 'Ранний доступ к новым играм', 'Приоритетная поддержка'], popular: false },
]

export default function Subscription() {
  const n = useNavigate()
  const child = useStore(s => s.children.find(c => c.id === s.activeChildId))
  const activeChildId = useStore(s => s.activeChildId)

  if (!child || !activeChildId) return <div className="page">Загрузка...</div>

  return (
    <div className="page">
      <button className="btn btn-sm btn-outline mb-16" onClick={() => n('/')}>← Назад</button>

      <div className="text-center mb-16">
        <div style={{ fontSize: 48, marginBottom: 8 }}>💎</div>
        <div className="text-lg mb-4">Logokitty Premium</div>
        <div className="text-muted">Открой все возможности приложения</div>
      </div>

      <div className="col gap-12">
        {plans.map(p => (
          <div key={p.id} className="card" style={{
            padding: 20, position: 'relative',
            border: p.popular ? '2px solid var(--orange)' : 'none',
          }}>
            {p.popular && (
              <span style={{
                position: 'absolute', top: -10, right: 16,
                background: 'var(--orange)', color: '#fff', padding: '2px 12px',
                borderRadius: 20, fontSize: 11, fontWeight: 600,
              }}>Популярное</span>
            )}
            <div className="row-between mb-8">
              <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--orange-dark)' }}>{p.price}</div>
            </div>
            <div className="col" style={{ gap: 6, marginBottom: 16 }}>
              {p.features.map(f => (
                <div key={f} className="row gap-8" style={{ fontSize: 13 }}>
                  <span style={{ color: 'green' }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => alert('Оплата offline — премиум-статус в разработке')}>
              {p.popular ? 'Оформить' : 'Выбрать'}
            </button>
          </div>
        ))}
      </div>

      <div className="card mt-16" style={{ padding: 16, background: '#fff8e1' }}>
        <div className="row gap-8" style={{ fontSize: 13 }}>
          <span>ℹ️</span>
          <span className="text-muted">В режиме offline оплата не выполняется. Премиум-статус устанавливается локально.</span>
        </div>
      </div>
    </div>
  )
}
