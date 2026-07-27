import { useState } from 'react'
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
  const [newTaskLabel, setNewTaskLabel] = useState({ morning: '', evening: '' })

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
    const pct = list.length ? (doneCount / list.length) * 100 : 0
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
          pct={routines.morning.length ? (morningCount / routines.morning.length) * 100 : 0}
          onToggle={(id) => toggle('morning', id)}
          onDelete={(id) => removeTask('morning', id)}
          newTaskLabel={newTaskLabel.morning}
          onNewTaskLabelChange={(v) => setNewTaskLabel({ ...newTaskLabel, morning: v })}
          onAddTask={() => addTask('morning')}
        />
        <RoutineCard
          title="🌙 Rotina da noite"
          tasks={routines.evening}
          doneMap={eveningDone}
          today={today}
          pct={routines.evening.length ? (eveningCount / routines.evening.length) * 100 : 0}
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
  doneMap,
  today,
  pct,
  onToggle,
  onDelete,
  newTaskLabel,
  onNewTaskLabelChange,
  onAddTask,
}) {
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
            onDelete={() => onDelete(task.id)}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            Nenhuma tarefa nesta rotina ainda.
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
