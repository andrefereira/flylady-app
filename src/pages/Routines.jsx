import ChecklistItem from '../components/ChecklistItem'
import ProgressBar from '../components/ProgressBar'
import Timer from '../components/Timer'
import { todayKey } from '../utils/dates'

function upsertHistory(history, date, patch) {
  const idx = history.findIndex((h) => h.date === date)
  if (idx === -1) {
    return [...history, { date, morningPct: 0, eveningPct: 0, ...patch }].slice(-30)
  }
  const copy = [...history]
  copy[idx] = { ...copy[idx], ...patch }
  return copy.slice(-30)
}

export default function Routines({ data, update }) {
  const { routines, history } = data
  const today = todayKey()

  function toggle(period, taskId) {
    const doneMap = { ...routines[`${period}Done`] }
    if (doneMap[taskId] === today) {
      delete doneMap[taskId]
    } else {
      doneMap[taskId] = today
    }
    const newRoutines = { ...routines, [`${period}Done`]: doneMap }

    const list = routines[period]
    const doneCount = list.filter((t) => doneMap[t.id] === today).length
    const pct = (doneCount / list.length) * 100
    const newHistory = upsertHistory(history, today, {
      [`${period}Pct`]: pct,
    })

    update({ routines: newRoutines, history: newHistory })
  }

  const morningDone = routines.morningDone
  const eveningDone = routines.eveningDone
  const morningCount = routines.morning.filter((t) => morningDone[t.id] === today).length
  const eveningCount = routines.evening.filter((t) => eveningDone[t.id] === today).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Rotinas diárias</h2>
        <p className="text-sm text-slate-500">
          Pequenos hábitos, todos os dias. As listas resetam sozinhas a cada novo dia.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RoutineCard
          title="☀️ Rotina da manhã"
          tasks={routines.morning}
          doneMap={morningDone}
          today={today}
          pct={(morningCount / routines.morning.length) * 100}
          onToggle={(id) => toggle('morning', id)}
        />
        <RoutineCard
          title="🌙 Rotina da noite"
          tasks={routines.evening}
          doneMap={eveningDone}
          today={today}
          pct={(eveningCount / routines.evening.length) * 100}
          onToggle={(id) => toggle('evening', id)}
        />
      </div>

      <Timer />
    </div>
  )
}

function RoutineCard({ title, tasks, doneMap, today, pct, onToggle }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <div className="mb-3">
        <ProgressBar pct={pct} />
      </div>
      <div className="divide-y divide-slate-50">
        {tasks.map((task) => (
          <ChecklistItem
            key={task.id}
            label={task.label}
            checked={doneMap[task.id] === today}
            onToggle={() => onToggle(task.id)}
          />
        ))}
      </div>
    </div>
  )
}
