import { useMemo, useState } from 'react'
import ChecklistItem from '../components/ChecklistItem'
import ProgressBar from '../components/ProgressBar'
import { currentZoneIndex, weekKey, todayKey } from '../utils/dates'
import { defaultZones } from '../utils/defaultState'

export default function Zones({ data, update }) {
  const zones = data.zones
  const activeIndex = useMemo(() => currentZoneIndex(zones.length), [zones.length])
  const wk = weekKey()

  const [selectedIndex, setSelectedIndex] = useState(activeIndex)
  const [newTaskLabel, setNewTaskLabel] = useState({})

  const zone = zones[selectedIndex]
  const isActive = selectedIndex === activeIndex
  const isCurrentWeek = zone.completedWeek === wk
  const completed = isCurrentWeek ? zone.completedTasks : []
  const pct = (completed.length / zone.tasks.length) * 100

  function toggleTask(taskId) {
    const newZones = zones.map((z, idx) => {
      if (idx !== selectedIndex) return z
      const currentCompleted = isCurrentWeek ? z.completedTasks : []
      const already = currentCompleted.includes(taskId)
      const completedTasks = already
        ? currentCompleted.filter((id) => id !== taskId)
        : [...currentCompleted, taskId]
      const allDone = completedTasks.length === z.tasks.length
      return {
        ...z,
        completedWeek: wk,
        completedTasks,
        lastCleaned: allDone ? todayKey() : z.lastCleaned,
      }
    })
    update({ zones: newZones })
  }

  function addTask() {
    const label = (newTaskLabel[zone.id] || '').trim()
    if (!label) return
    const newTask = { id: `custom-${Date.now()}`, label }
    const newZones = zones.map((z, idx) =>
      idx === selectedIndex ? { ...z, tasks: [...z.tasks, newTask] } : z
    )
    update({ zones: newZones })
    setNewTaskLabel({ ...newTaskLabel, [zone.id]: '' })
  }

  function removeTask(taskId) {
    const newZones = zones.map((z, idx) => {
      if (idx !== selectedIndex) return z
      return {
        ...z,
        tasks: z.tasks.filter((t) => t.id !== taskId),
        completedTasks: z.completedTasks.filter((id) => id !== taskId),
      }
    })
    update({ zones: newZones })
  }

  function restoreDefaults() {
    const fresh = defaultZones.find((z) => z.id === zone.id)
    if (!fresh) return
    const newZones = zones.map((z, idx) =>
      idx === selectedIndex
        ? {
            ...z,
            tasks: JSON.parse(JSON.stringify(fresh.tasks)),
            completedWeek: null,
            completedTasks: [],
          }
        : z
    )
    update({ zones: newZones })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Zonas da casa</h2>
        <p className="text-sm text-slate-500">
          A cada semana o app destaca uma zona diferente para uma limpeza mais profunda.
          Use o menu abaixo para ver qualquer zona, mesmo fora da vez dela.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Escolher zona
        </label>
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {zones.map((z, idx) => (
            <option key={z.id} value={idx}>
              {z.name}
              {idx === activeIndex ? ' — zona da semana' : ''}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`bg-white rounded-xl border p-5 ${
          isActive ? 'border-teal-400 ring-1 ring-teal-200' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            {zone.name}
            {isActive && (
              <span className="text-[11px] font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                Zona da semana
              </span>
            )}
          </h3>
          <span className="text-xs text-slate-400">
            {zone.lastCleaned ? `Última limpeza: ${zone.lastCleaned}` : 'Ainda não limpa'}
          </span>
        </div>

        <div className="mb-3">
          <ProgressBar pct={pct} />
        </div>

        <div className="divide-y divide-slate-50">
          {zone.tasks.map((task) => (
            <ChecklistItem
              key={task.id}
              label={task.label}
              checked={completed.includes(task.id)}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => removeTask(task.id)}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={newTaskLabel[zone.id] || ''}
            onChange={(e) =>
              setNewTaskLabel({ ...newTaskLabel, [zone.id]: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTask()
              }
            }}
            placeholder="Nova tarefa para esta zona..."
            className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={addTask}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-lg transition"
          >
            Adicionar
          </button>
        </div>

        <button
          onClick={restoreDefaults}
          className="mt-3 text-xs text-slate-400 hover:text-teal-600 transition"
        >
          Restaurar tarefas padrão desta zona
        </button>
      </div>
    </div>
  )
}
