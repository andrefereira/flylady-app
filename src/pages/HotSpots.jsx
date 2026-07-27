import { useState } from 'react'
import { todayKey } from '../utils/dates'

export default function HotSpots({ data, update }) {
  const [newSpot, setNewSpot] = useState('')
  const hotspots = data.hotspots

  function addSpot(e) {
    e.preventDefault()
    const label = newSpot.trim()
    if (!label) return
    const spot = {
      id: `hs-${Date.now()}`,
      label,
      resolvedToday: false,
      lastResolved: null,
      timesResolved: 0,
    }
    update({ hotspots: [...hotspots, spot] })
    setNewSpot('')
  }

  function resolve(id) {
    const today = todayKey()
    const newSpots = hotspots.map((s) =>
      s.id === id
        ? {
            ...s,
            lastResolved: today,
            timesResolved: s.timesResolved + (s.lastResolved !== today ? 1 : 0),
          }
        : s
    )
    update({ hotspots: newSpots })
  }

  function remove(id) {
    update({ hotspots: hotspots.filter((s) => s.id !== id) })
  }

  const today = todayKey()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Hot Spots</h2>
        <p className="text-sm text-slate-500">
          Aqueles pontos da casa que sempre viram bagunça (mesa, sofá, entrada...).
          Cadastre e resolva sempre que precisar.
        </p>
      </div>

      <form onSubmit={addSpot} className="flex gap-2">
        <input
          value={newSpot}
          onChange={(e) => setNewSpot(e.target.value)}
          placeholder="Ex: Mesa da cozinha"
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition">
          Adicionar
        </button>
      </form>

      {hotspots.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-8">
          Nenhum hot spot cadastrado ainda.
        </p>
      )}

      <div className="grid gap-3">
        {hotspots.map((spot) => {
          const resolvedToday = spot.lastResolved === today
          return (
            <div
              key={spot.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium text-slate-800">{spot.label}</p>
                <p className="text-xs text-slate-400">
                  Resolvido {spot.timesResolved}x
                  {spot.lastResolved ? ` · última vez: ${spot.lastResolved}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => resolve(spot.id)}
                  disabled={resolvedToday}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    resolvedToday
                      ? 'bg-teal-50 text-teal-600 cursor-default'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {resolvedToday ? 'Resolvido hoje ✓' : 'Resolver'}
                </button>
                <button
                  onClick={() => remove(spot.id)}
                  className="text-slate-300 hover:text-red-500 text-sm"
                  title="Remover"
                >
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
