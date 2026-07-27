import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ProgressBar from '../components/ProgressBar'
import { currentZoneIndex, lastNDays, todayKey, weekKey, formatDayLabel } from '../utils/dates'

export default function Progress({ data }) {
  const { history, zones, hotspots, decluttering } = data

  const chartData = lastNDays(7).map((d) => {
    const key = todayKey(d)
    const entry = history.find((h) => h.date === key)
    return {
      day: formatDayLabel(key),
      Manhã: entry ? Math.round(entry.morningPct || 0) : 0,
      Noite: entry ? Math.round(entry.eveningPct || 0) : 0,
    }
  })

  const hotspotsResolvedTotal = hotspots.reduce((sum, s) => sum + s.timesResolved, 0)

  const wk = weekKey()
  const activeZoneIndex = currentZoneIndex(zones.length)
  const zoneProgress = zones.map((z, idx) => {
    const completed = z.completedWeek === wk ? z.completedTasks.length : 0
    const pct = z.tasks.length ? (completed / z.tasks.length) * 100 : 0
    return { id: z.id, name: z.name, pct, isActive: idx === activeZoneIndex }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Progresso</h2>
        <p className="text-sm text-slate-500">
          Sem sequências para não quebrar, sem culpa por dias perdidos.
          Só um retrato de como a semana está indo.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">
          Rotinas concluídas — últimos 7 dias
        </h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Bar dataKey="Manhã" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Noite" fill="#7dd3c0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Zonas desta semana</h3>
        <div className="space-y-3">
          {zoneProgress.map((z) => (
            <div key={z.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-700 flex items-center gap-1.5">
                  {z.name}
                  {z.isActive && (
                    <span className="text-[10px] font-medium bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
                      semana
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-400">{Math.round(z.pct)}%</span>
              </div>
              <ProgressBar pct={z.pct} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Itens descartados" value={decluttering.totalItemsRemoved} icon="🗑️" />
        <StatCard label="Hot spots resolvidos" value={hotspotsResolvedTotal} icon="🔥" />
        <StatCard
          label="Zonas com registro de limpeza"
          value={zones.filter((z) => z.lastCleaned).length}
          icon="🏠"
        />
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 text-sm text-teal-800">
        Lembrete da FlyLady: você não está atrasada. Comece de onde você está, um passo
        de cada vez. 🪽
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  )
}
