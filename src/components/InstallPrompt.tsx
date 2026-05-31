import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<Event | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferred(e) }
    const installedHandler = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const install = async () => {
    if (!deferred) return
    ;(deferred as any).prompt()
    const result = await (deferred as any).userChoice
    if (result.outcome === 'accepted') { setInstalled(true); setDeferred(null) }
  }

  if (installed || !deferred) return null

  return (
    <div style={{ position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 100 }}>
      <div className="card" style={{ textAlign: 'center', padding: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📲</div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Установи Логокотик на телефон</div>
        <div className="row justify-center gap-8">
          <button className="btn btn-sm btn-primary" onClick={install}>Установить</button>
          <button className="btn btn-sm btn-outline" onClick={() => setDeferred(null)}>Позже</button>
        </div>
      </div>
    </div>
  )
}
