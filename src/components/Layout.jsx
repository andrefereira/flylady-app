import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const tabs = [
  { to: '/zonas', label: 'Zonas', icon: '🏠' },
  { to: '/rotinas', label: 'Rotinas', icon: '☀️' },
  { to: '/hotspots', label: 'Hot Spots', icon: '🔥' },
  { to: '/decluttering', label: 'Descarte', icon: '🗑️' },
  { to: '/journal', label: 'Journal', icon: '📓' },
  { to: '/progresso', label: 'Progresso', icon: '📈' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪽</span>
            <span className="font-bold text-slate-800">FlyLady App</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-slate-500">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={logout}
              className="text-sm text-slate-500 hover:text-red-600 transition"
            >
              Sair
            </button>
          </div>
        </div>
        <nav className="max-w-4xl mx-auto px-2 flex gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${
                  isActive
                    ? 'border-teal-600 text-teal-700 bg-teal-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span>{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">{children}</main>

      <footer className="text-center text-xs text-slate-400 py-4">
        Progresso, não perfeição. 🪽
      </footer>
    </div>
  )
}
