import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useUserData } from './hooks/useUserData'
import Layout from './components/Layout'
import Login from './pages/Login'
import Zones from './pages/Zones'
import Routines from './pages/Routines'
import HotSpots from './pages/HotSpots'
import Decluttering from './pages/Decluttering'
import ControlJournal from './pages/ControlJournal'
import Progress from './pages/Progress'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
      Carregando...
    </div>
  )
}

function PrivateApp() {
  const { user } = useAuth()
  const { data, update, loading } = useUserData(user?.uid)

  if (loading || !data) return <LoadingScreen />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/zonas" replace />} />
        <Route path="/zonas" element={<Zones data={data} update={update} />} />
        <Route path="/rotinas" element={<Routines data={data} update={update} />} />
        <Route path="/hotspots" element={<HotSpots data={data} update={update} />} />
        <Route path="/decluttering" element={<Decluttering data={data} update={update} />} />
        <Route path="/journal" element={<ControlJournal data={data} update={update} />} />
        <Route path="/progresso" element={<Progress data={data} />} />
        <Route path="*" element={<Navigate to="/zonas" replace />} />
      </Routes>
    </Layout>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return <PrivateApp />
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  )
}
