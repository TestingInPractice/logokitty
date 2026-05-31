import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../api/db'

declare global { interface Window { onTelegramAuth?: (user: { id: number; first_name: string; username?: string; photo_url?: string; auth_date: number; hash: string }) => void } }

export default function Auth() {
  const n = useNavigate()
  const [loading, setLoading] = useState(false)
  const [widgetFailed, setWidgetFailed] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    db.getUser().then(user => {
      if (user) { n('/feed'); return }
    })

    window.onTelegramAuth = async (tgUser) => {
      setLoading(true)
      const existing = await db.getUser()
      if (existing) { n('/feed'); return }
      await db.setUser({
        id: String(tgUser.id),
        name: tgUser.first_name,
        telegramAvatarUrl: tgUser.photo_url,
        createdAt: Date.now(),
      })
      n('/feed')
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'LogopotamBot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    script.onerror = () => setWidgetFailed(true)
    const container = document.getElementById('tg-widget')
    if (container) container.appendChild(script)

    const timer = setTimeout(() => setWidgetFailed(true), 4000)
    return () => clearTimeout(timer)
  }, [n])

  const skip = async () => {
    setLoading(true)
    await db.setUser({ id: db.generateId(), name: 'Родитель', createdAt: Date.now() })
    n('/feed')
  }

  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🐱</div>
      <div className="text-lg" style={{ fontSize: 28, marginBottom: 8 }}>Логокотик</div>
      <div className="text-muted" style={{ marginBottom: 32 }}>Логопедическое приложение для детей 2–8 лет</div>

      {widgetFailed ? (
        <div className="card" style={{ padding: 20, background: '#fff8e1', marginBottom: 24 }}>
          <div className="text-muted mb-8">
            Telegram Login недоступен на этом домене.
            Используй демо-вход:
          </div>
          <button className="btn btn-primary" onClick={skip} disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти как гость'}
          </button>
        </div>
      ) : (
        <>
          <div id="tg-widget" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, minHeight: 60 }}></div>
          {loading && <div className="text-muted">Загрузка...</div>}
          <button className="btn btn-outline btn-sm" onClick={skip} style={{ marginTop: 24 }}>
            Пропустить вход (демо)
          </button>
        </>
      )}
    </div>
  )
}
