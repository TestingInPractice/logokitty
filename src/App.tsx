import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { db } from './api/db'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Feed from './pages/Feed'
import ChildHome from './pages/ChildHome'
import ChildCreate from './pages/ChildCreate'
import SectionView from './pages/SectionView'
import Game from './pages/Game'
import Shop from './pages/Shop'
import Diagnostics from './pages/Diagnostics'

function Protected({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => { db.getUser().then(u => setOk(!!u)) }, [])
  if (ok === null) return <div className="page">Загрузка...</div>
  return ok ? <>{children}</> : <Navigate to="/auth" replace />
}

export default function App() {
  const loadUser = useStore(s => s.loadUser)
  useEffect(() => { loadUser() }, [loadUser])

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/child" element={<ChildHome />} />
        <Route path="/child/create" element={<ChildCreate />} />
        <Route path="/section/:id" element={<SectionView />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}
