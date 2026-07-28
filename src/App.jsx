import { useEffect } from 'react'
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
import BabySteps from './pages/BabySteps'
import { todayKey } from './utils/dates'
import { getCurrentDay, getDayInfo } from './utils/babySteps'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
      Carregando...
    </div>
  )
}

function useBabyStepReminder(startDate) {
  useEffect(() => {
    if (!startDate) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

    const flagKey = `flylady-babystep-notified-${todayKey()}`
    if (localStorage.getItem(flagKey)) return

    const info = getDayInfo(getCurrentDay(startDate))
    new Notification(`FlyLady — Dia ${info.day}: ${info.title}`, {
      body: info.description,
      icon: `${import.meta.env.BASE_URL}icon-192.png`,
    })
    localStorage.setItem(flagKey, '1')
  }, [startDate])
}

function PrivateApp() {
  const { user } = useAuth()
  const { data, update, loading } = useUserData(user?.uid)

  useBabyStepReminder(data?.babySteps?.startDate)

  if (loading || !data) return <LoadingScreen />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/baby-steps" replace />} />
        <Route path="/baby-steps" element={<BabySteps data={data} update={update} />} />
        <Route path="/zonas" element={<Zones data={data} update={update} />} />
        <Route path="/rotinas" element={<Routines data={data} update={update} />} />
        <Route path="/hotspots" element={<HotSpots data={data} update={update} />} />
        <Route path="/decluttering" element={<Decluttering data={data} update={update} />} />
        <Route path="/journal" element={<ControlJournal data={data} update={update} />} />
        <Route path="/progresso" element={<Progress data={data} />} />
        <Route path="*" element={<Navigate to="/baby-steps" replace />} />
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
