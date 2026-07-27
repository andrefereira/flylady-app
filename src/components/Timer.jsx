import { useEffect, useRef, useState } from 'react'

const DEFAULT_MINUTES = 15

export default function Timer() {
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setFinished(true)
            playBeep()
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function playBeep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      const ctx = audioCtxRef.current || new Ctx()
      audioCtxRef.current = ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch {
      // ambiente sem suporte a áudio, ignora silenciosamente
    }
  }

  function start() {
    setFinished(false)
    setRunning(true)
  }

  function pause() {
    setRunning(false)
  }

  function reset(mins = minutes) {
    clearInterval(intervalRef.current)
    setRunning(false)
    setFinished(false)
    setSecondsLeft(mins * 60)
  }

  function changeMinutes(mins) {
    setMinutes(mins)
    reset(mins)
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const pct = 100 - (secondsLeft / (minutes * 60)) * 100

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-700 text-sm">⏱️ Timer de 15 minutos</h3>
        <div className="flex gap-1 text-xs">
          {[5, 15, 30].map((m) => (
            <button
              key={m}
              onClick={() => changeMinutes(m)}
              className={`px-2 py-1 rounded-md border ${
                minutes === m
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {m}min
            </button>
          ))}
        </div>
      </div>

      <div className="text-center py-2">
        <span className={`text-4xl font-mono font-bold ${finished ? 'text-teal-600' : 'text-slate-800'}`}>
          {mm}:{ss}
        </span>
        {finished && <p className="text-sm text-teal-600 mt-1">Tempo esgotado! Bom trabalho 🎉</p>}
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex gap-2 justify-center">
        {!running ? (
          <button
            onClick={start}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
          >
            {secondsLeft === minutes * 60 ? 'Começar' : 'Continuar'}
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition"
          >
            Pausar
          </button>
        )}
        <button
          onClick={() => reset()}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg transition"
        >
          Reiniciar
        </button>
      </div>
    </div>
  )
}
