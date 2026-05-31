import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { db } from './api/db'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Feed from './pages/Feed'

function Protected({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => { db.getUser().then(u => setOk(!!u)) }, [])
  if (ok === null) return <div className="page">Загрузка...</div>
  return ok ? <>{children}</> : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/feed" element={<Feed />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}
