import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Feed from './pages/Feed'
import ChildHome from './pages/ChildHome'
import SectionView from './pages/SectionView'
import Game from './pages/Game'
import Shop from './pages/Shop'
import Settings from './pages/Settings'
import Subscription from './pages/Subscription'

function Protected({ children }: { children: React.ReactNode }) {
  return useStore(s => s.user) ? <>{children}</> : <Navigate to="/auth" replace />
}

function HasChild({ children }: { children: React.ReactNode }) {
  return useStore(s => s.activeChildId) ? <>{children}</> : <Navigate to="/feed" replace />
}

export default function App() {
  const init = useStore(s => s.init)
  useEffect(() => { init() }, [init])
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/child" element={<HasChild><ChildHome /></HasChild>} />
        <Route path="/section/:id" element={<HasChild><SectionView /></HasChild>} />
        <Route path="/game/:id" element={<HasChild><Game /></HasChild>} />
        <Route path="/shop" element={<HasChild><Shop /></HasChild>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<Subscription />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}
