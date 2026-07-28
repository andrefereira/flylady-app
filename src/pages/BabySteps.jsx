import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import { todayKey } from '../utils/dates'
import { TOTAL_DAYS, coreHabits, getCurrentDay, getDayInfo } from '../utils/babySteps'

export default function BabySteps({ data, update }) {
  const babySteps = data.babySteps || { startDate: null, doneDays: {} }
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )

  function start() {
    update({ babySteps: { startDate: todayKey(), doneDays: {} } })
  }

  function restart() {
    if (!window.confirm('Reiniciar o programa do dia 1? Seu histórico de dias marcados será apagado.')) {
      return
    }
    update({ babySteps: { startDate: todayKey(), doneDays: {} } })
  }

  function toggleDay(day) {
    const doneDays = { ...babySteps.doneDays }
    if (doneDays[day]) delete doneDays[day]
    else doneDays[day] = true
    update({ babySteps: { ...babySteps, doneDays } })
  }

  async function enableNotifications() {
    if (typeof Notification === 'undefined') return
    const permission = await Notification.requestPermission()
    setNotifStatus(permission)
  }

  if (!babySteps.startDate) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Baby Steps</h2>
          <p className="text-sm text-slate-500">
            O guia de 31 dias do método FlyLady para quem está começando agora.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Os Baby Steps existem para você não desistir por cansaço: um hábito novo por
            dia, no seu ritmo, sem tentar arrumar a casa toda de uma vez. A cada dia um
            novo passo é liberado aqui no app.
          </p>
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
            <p className="text-sm font-medium text-teal-800 mb-2">
              Se você esquecer tudo, foque só nestes 3:
            </p>
            <ul className="text-sm text-teal-800 space-y-1 list-disc list-inside">
              {coreHabits.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={start}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg py-2.5 transition"
          >
            Começar meus Baby Steps — Dia 1
          </button>
        </div>
      </div>
    )
  }

  const currentDay = getCurrentDay(babySteps.startDate)
  const today = getDayInfo(currentDay)
  const doneCount = Object.keys(babySteps.doneDays).length
  const isFinished = currentDay >= TOTAL_DAYS

  const history = []
  for (let d = currentDay - 1; d >= 1; d--) {
    history.push(getDayInfo(d))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Baby Steps</h2>
        <p className="text-sm text-slate-500">
          Um hábito novo por dia. Sem pressa — o próximo passo é liberado amanhã.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Dia {currentDay} de {TOTAL_DAYS}
          </span>
          <span className="text-xs text-slate-400">{doneCount} marcados como feitos</span>
        </div>
        <ProgressBar pct={(currentDay / TOTAL_DAYS) * 100} />
      </div>

      {notifStatus === 'default' && (
        <button
          onClick={enableNotifications}
          className="w-full text-sm bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg py-2.5 transition"
        >
          🔔 Ativar lembrete diário do passo de hoje
        </button>
      )}
      {notifStatus === 'granted' && (
        <p className="text-xs text-teal-600 text-center">🔔 Lembretes diários ativados</p>
      )}
      {notifStatus === 'denied' && (
        <p className="text-xs text-slate-400 text-center">
          Notificações bloqueadas no navegador. Ative nas configurações do site se quiser
          lembretes.
        </p>
      )}

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
        <p className="text-sm font-medium text-teal-800 mb-2">
          Se você esquecer tudo, foque só nestes 3:
        </p>
        <ul className="text-sm text-teal-800 space-y-1 list-disc list-inside">
          {coreHabits.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>

      <DayCard
        info={today}
        highlighted
        done={!!babySteps.doneDays[currentDay]}
        onToggle={() => toggleDay(currentDay)}
      />

      {!isFinished && (
        <p className="text-xs text-slate-400 text-center">
          🔒 O passo do Dia {Math.min(currentDay + 1, TOTAL_DAYS)} é liberado amanhã.
        </p>
      )}

      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Dias anteriores</h3>
          <div className="space-y-2">
            {history.map((info) => (
              <DayCard
                key={info.day}
                info={info}
                done={!!babySteps.doneDays[info.day]}
                onToggle={() => toggleDay(info.day)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={restart}
        className="text-xs text-slate-400 hover:text-red-600 transition block mx-auto"
      >
        Reiniciar programa do dia 1
      </button>
    </div>
  )
}

function DayCard({ info, done, onToggle, highlighted }) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 ${
        highlighted ? 'border-teal-400 ring-1 ring-teal-200' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={done}
          className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-md border-2 flex items-center justify-center transition ${
            done ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 hover:border-teal-400'
          }`}
        >
          {done && '✓'}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-400">Dia {info.day}</span>
            {highlighted && (
              <span className="text-[11px] font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                Hoje
              </span>
            )}
          </div>
          <p className={`font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {info.title}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">{info.description}</p>
          {info.isReinforcement && info.learnedSoFar.length > 0 && (
            <ul className="text-xs text-slate-400 mt-2 space-y-0.5 list-disc list-inside">
              {info.learnedSoFar.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
