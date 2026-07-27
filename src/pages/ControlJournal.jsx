import { useState } from 'react'
import ChecklistItem from '../components/ChecklistItem'
import { todayKey } from '../utils/dates'

export default function ControlJournal({ data, update }) {
  const { controlJournal } = data
  const [newListTitle, setNewListTitle] = useState('')
  const [newTaskLabel, setNewTaskLabel] = useState({})
  const today = todayKey()

  function saveNotes(notes) {
    update({ controlJournal: { ...controlJournal, notes } })
  }

  function addChecklist(e) {
    e.preventDefault()
    const title = newListTitle.trim()
    if (!title) return
    const list = {
      id: `cl-${Date.now()}`,
      title,
      tasks: [],
      done: {},
    }
    update({
      controlJournal: {
        ...controlJournal,
        customChecklist: [...controlJournal.customChecklist, list],
      },
    })
    setNewListTitle('')
  }

  function removeChecklist(listId) {
    update({
      controlJournal: {
        ...controlJournal,
        customChecklist: controlJournal.customChecklist.filter((l) => l.id !== listId),
      },
    })
  }

  function addTask(listId) {
    const label = (newTaskLabel[listId] || '').trim()
    if (!label) return
    const customChecklist = controlJournal.customChecklist.map((l) =>
      l.id === listId
        ? { ...l, tasks: [...l.tasks, { id: `t-${Date.now()}`, label }] }
        : l
    )
    update({ controlJournal: { ...controlJournal, customChecklist } })
    setNewTaskLabel({ ...newTaskLabel, [listId]: '' })
  }

  function toggleTask(listId, taskId) {
    const customChecklist = controlJournal.customChecklist.map((l) => {
      if (l.id !== listId) return l
      const done = { ...l.done }
      if (done[taskId] === today) delete done[taskId]
      else done[taskId] = today
      return { ...l, done }
    })
    update({ controlJournal: { ...controlJournal, customChecklist } })
  }

  function removeTask(listId, taskId) {
    const customChecklist = controlJournal.customChecklist.map((l) =>
      l.id === listId ? { ...l, tasks: l.tasks.filter((t) => t.id !== taskId) } : l
    )
    update({ controlJournal: { ...controlJournal, customChecklist } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Control Journal</h2>
        <p className="text-sm text-slate-500">
          Seu espaço livre: anotações e listas personalizadas, do jeito que funcionar
          para a sua casa.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-2">Anotações</h3>
        <textarea
          className="w-full min-h-[140px] border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Anote lembretes, ideias, listas soltas..."
          defaultValue={controlJournal.notes}
          onBlur={(e) => saveNotes(e.target.value)}
        />
        <p className="text-xs text-slate-400 mt-1">Salvo automaticamente ao sair do campo.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Listas personalizadas</h3>
        <form onSubmit={addChecklist} className="flex gap-2 mb-4">
          <input
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Nova lista (ex: Rotina de viagem)"
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition">
            Criar
          </button>
        </form>

        <div className="space-y-4">
          {controlJournal.customChecklist.map((list) => (
            <div key={list.id} className="border border-slate-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-700">{list.title}</h4>
                <button
                  onClick={() => removeChecklist(list.id)}
                  className="text-slate-300 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="divide-y divide-slate-50 mb-2">
                {list.tasks.map((task) => (
                  <ChecklistItem
                    key={task.id}
                    label={task.label}
                    checked={list.done[task.id] === today}
                    onToggle={() => toggleTask(list.id, task.id)}
                    onDelete={() => removeTask(list.id, task.id)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTaskLabel[list.id] || ''}
                  onChange={(e) =>
                    setNewTaskLabel({ ...newTaskLabel, [list.id]: e.target.value })
                  }
                  placeholder="Nova tarefa..."
                  className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTask(list.id)
                    }
                  }}
                />
                <button
                  onClick={() => addTask(list.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
          {controlJournal.customChecklist.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">
              Nenhuma lista personalizada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
