import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChecklistItem from '../components/ChecklistItem'
import ProgressBar from '../components/ProgressBar'
import Timer from '../components/Timer'
import { todayKey } from '../utils/dates'
import { isRoutineTaskUnlocked, routineUnlockLabel } from '../utils/babySteps'

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
  const babySteps = data.babySteps || { startDate: null, doneDays: {} }
  const today = todayKey()
  const [newTaskLabel, setNewTaskLabel] = useState({ morning: '', evening: '' })

  function unlockedOf(period) {
    return routines[period].filter((t) => isRoutineTaskUnlocked(t, babySteps))
  }

  function toggle(period, taskId) {
    const doneMap = { ...routines[`${period}Done`] }
    if (doneMap[taskId] === today) {
      delete doneMap[taskId]
    } else {
      doneMap[taskId] = today
    }
    const newRoutines = { ...routines, [`${period}Done`]: doneMap }

    const unlocked = unlockedOf(period)
    const doneCount = unlocked.filter((t) => doneMap[t.id] === today).length
    const pct = unlocked.length ? (doneCount / unlocked.length) * 100 : 0
    const newHistory = upsertHistory(history, today, {
      [`${period}Pct`]: pct,
    })

    update({ routines: newRoutines, history: newHistory })
  }

  function addTask(period) {
    const label = newTaskLabel[period].trim()
    if (!label) return
    const newTask = { id: `${period[0]}-${Date.now()}`, label }
    const newRoutines = { ...routines, [period]: [...routines[period], newTask] }
    update({ routines: newRoutines })
    setNewTaskLabel({ ...newTaskLabel, [period]: '' })
  }

  function removeTask(period, taskId) {
    const doneMap = { ...routines[`${period}Done`] }
    delete doneMap[taskId]
    const newRoutines = {
      ...routines,
      [period]: routines[period].filter((t) => t.id !== taskId),
      [`${period}Done`]: doneMap,
    }
    update({ routines: newRoutines })
  }

  const morningDone = routines.morningDone
  const eveningDone = routines.eveningDone
  const morningUnlocked = unlockedOf('morning')
  const eveningUnlocked = unlockedOf('evening')
  const morningCount = morningUnlocked.filter((t) => morningDone[t.id] === today).length
  const eveningCount = eveningUnlocked.filter((t) => eveningDone[t.id] === today).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Rotinas diárias</h2>
        <p className="text-sm text-slate-500">
          Pequenos hábitos, todos os dias. As listas resetam sozinhas a cada novo dia.
        </p>
      </div>

      {!babySteps.startDate && (
        <Link
          to="/baby-steps"
          className="block bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-800 hover:bg-teal-100 transition"
        >
          🐣 Suas rotinas são liberadas aos poucos conforme você avança nos Baby Steps.
          Comece por lá para desbloquear seus primeiros hábitos.
        </Link>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <RoutineCard
          title="☀️ Rotina da manhã"
          tasks={routines.morning}
          babySteps={babySteps}
          doneMap={morningDone}
          today={today}
          pct={morningUnlocked.length ? (morningCount / morningUnlocked.length) * 100 : 0}
          onToggle={(id) => toggle('morning', id)}
          onDelete={(id) => removeTask('morning', id)}
          newTaskLabel={newTaskLabel.morning}
          onNewTaskLabelChange={(v) => setNewTaskLabel({ ...newTaskLabel, morning: v })}
          onAddTask={() => addTask('morning')}
        />
        <RoutineCard
          title="🌙 Rotina da noite"
          tasks={routines.evening}
          babySteps={babySteps}
          doneMap={eveningDone}
          today={today}
          pct={eveningUnlocked.length ? (eveningCount / eveningUnlocked.length) * 100 : 0}
          onToggle={(id) => toggle('evening', id)}
          onDelete={(id) => removeTask('evening', id)}
          newTaskLabel={newTaskLabel.evening}
          onNewTaskLabelChange={(v) => setNewTaskLabel({ ...newTaskLabel, evening: v })}
          onAddTask={() => addTask('evening')}
        />
      </div>

      <Timer />
    </div>
  )
}

function RoutineCard({
  title,
  tasks,
  babySteps,
  doneMap,
  today,
  pct,
  onToggle,
  onDelete,
  newTaskLabel,
  onNewTaskLabelChange,
  onAddTask,
}) {
  const unlockedCount = tasks.filter((t) => isRoutineTaskUnlocked(t, babySteps)).length

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <div className="mb-3">
        <ProgressBar pct={pct} />
      </div>
      <div className="divide-y divide-slate-50">
        {tasks.map((task) =>
          isRoutineTaskUnlocked(task, babySteps) ? (
            <ChecklistItem
              key={task.id}
              label={task.label}
              checked={doneMap[task.id] === today}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
            />
          ) : (
            <LockedRow key={task.id} label={task.label} unlockLabel={routineUnlockLabel(task)} />
          )
        )}
        {unlockedCount === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            Nenhum hábito liberado ainda nesta rotina.
          </p>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          value={newTaskLabel}
          onChange={(e) => onNewTaskLabelChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAddTask()
            }
          }}
          placeholder="Nova tarefa para esta rotina..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={onAddTask}
          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-lg transition"
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}

function LockedRow({ label, unlockLabel }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-slate-200 flex items-center justify-center text-slate-300 text-xs">
        🔒
      </span>
      <div className="flex-1">
        <span className="text-sm text-slate-400">{label}</span>
        <p className="text-[11px] text-slate-400">{unlockLabel}</p>
      </div>
    </div>
  )
}
