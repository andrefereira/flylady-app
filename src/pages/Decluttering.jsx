import ProgressBar from '../components/ProgressBar'
import { todayKey } from '../utils/dates'

export default function Decluttering({ data, update }) {
  const { decluttering } = data
  const today = todayKey()
  const didToday = decluttering.dailyDone[today]

  function addToChallenge(amount) {
    const newCount = Math.max(0, decluttering.challengeCount + amount)
    const completedRound = newCount >= decluttering.challengeGoal
    const totalItemsRemoved =
      decluttering.totalItemsRemoved + (amount > 0 ? amount : 0)

    update({
      decluttering: {
        ...decluttering,
        challengeCount: completedRound ? 0 : newCount,
        totalItemsRemoved,
      },
    })
  }

  function toggleDailyDeclutter() {
    const dailyDone = { ...decluttering.dailyDone }
    if (dailyDone[today]) {
      delete dailyDone[today]
    } else {
      dailyDone[today] = true
    }
    update({ decluttering: { ...decluttering, dailyDone } })
  }

  const pct = (decluttering.challengeCount / decluttering.challengeGoal) * 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Descarte (Decluttering)</h2>
        <p className="text-sm text-slate-500">
          Menos coisas, menos bagunça para organizar. Sem culpa — cada item conta.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-1">
          Desafio dos 27 itens
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Separe 27 itens para doar ou jogar fora. Ao completar, o contador reinicia
          para uma nova rodada.
        </p>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl font-bold text-slate-800">
            {decluttering.challengeCount}
          </span>
          <span className="text-slate-400">/ {decluttering.challengeGoal}</span>
        </div>
        <ProgressBar pct={pct} />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => addToChallenge(1)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
          >
            +1 item
          </button>
          <button
            onClick={() => addToChallenge(5)}
            className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-medium rounded-lg transition"
          >
            +5 itens
          </button>
          <button
            onClick={() => addToChallenge(-1)}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-sm rounded-lg transition"
          >
            −1
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-1">
          Descarte diário de 5 minutos
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Um pequeno hábito diário: 5 minutos procurando algo para descartar.
        </p>
        <button
          onClick={toggleDailyDeclutter}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            didToday
              ? 'bg-teal-50 text-teal-700'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {didToday ? 'Feito hoje ✓' : 'Marcar como feito hoje'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
        <p className="text-sm text-slate-500">Total de itens descartados</p>
        <p className="text-3xl font-bold text-teal-600">
          {decluttering.totalItemsRemoved}
        </p>
      </div>
    </div>
  )
}
