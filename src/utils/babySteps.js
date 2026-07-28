import { differenceInCalendarDays, parseISO } from 'date-fns'

export const TOTAL_DAYS = 31

// Passos com hábito novo. Nos dias que não aparecem aqui, o app mostra um
// "dia de reforço" com os hábitos já aprendidos até ali — assim os 31 dias
// do método ficam completos mesmo sem uma instrução nova a cada dia.
export const babyStepsContent = [
  {
    day: 1,
    title: 'Brilhar a pia',
    description: 'Lave, seque e dê brilho na pia da cozinha. Ela deve dormir vazia e brilhando.',
  },
  {
    day: 2,
    title: 'Vestir-se da cabeça aos pés',
    description:
      'Vista-se por completo, incluindo sapatos (de preferência de amarrar). Isso sinaliza ao seu cérebro que você está "em serviço".',
  },
  {
    day: 3,
    title: 'Explorar o método',
    description: 'Leia mais sobre o método FlyLady e reforce os dois primeiros hábitos.',
  },
  {
    day: 4,
    title: 'Post-its de lembrete',
    description: 'Escreva "Pia" e "Vestir-se" em post-its e cole no espelho ou na cozinha.',
  },
  {
    day: 5,
    title: 'Controlar pensamentos negativos',
    description: 'Substitua o "eu não consigo" por "estou aprendendo".',
  },
  {
    day: 6,
    title: 'Extinguir hotspots',
    description: 'Passe 2 minutos limpando aquele balcão ou cantinho onde tudo se acumula.',
  },
  {
    day: 8,
    title: 'O Caderno de Controle',
    description:
      'Comece a anotar suas rotinas em um caderno ou fichário (aqui no app, use a aba Journal).',
  },
  {
    day: 9,
    title: 'Destralhe de 5 minutos',
    description: 'Escolha um foco de bagunça e jogue fora ou doe o que não presta.',
  },
  {
    day: 10,
    title: 'O poder dos 15 minutos',
    description: 'Coloque um cronômetro de 15 minutos. Você consegue fazer qualquer coisa por 15 minutos!',
  },
  {
    day: 11,
    title: 'Adicionar a rotina da noite',
    description: 'Prepare a roupa do dia seguinte e verifique sua agenda antes de dormir.',
  },
  {
    day: 13,
    title: 'Missão da semana',
    description: 'Comece a seguir uma pequena tarefa sugerida para a zona da semana.',
  },
  {
    day: 17,
    title: 'Horário de dormir',
    description: 'Estabeleça uma hora fixa para ir para a cama. O descanso é parte do método.',
  },
  {
    day: 20,
    title: 'Lavar a roupa',
    description:
      'Crie o hábito de lavar, estender e guardar uma carga de roupa por dia, para não acumular pilhas.',
  },
  {
    day: 28,
    title: 'Alimentação e hidratação',
    description: 'Cuide da sua "máquina" (você!): beba mais água e capriche na alimentação.',
  },
]

export const coreHabits = [
  'Brilhar a pia todas as noites',
  'Vestir-se e calçar sapatos logo ao acordar',
  'Cronometrar 15 minutos de destralhe diário',
]

// Calcula o dia atual do programa (1 a 31) a partir da data de início.
export function getCurrentDay(startDate) {
  if (!startDate) return 1
  const diff = differenceInCalendarDays(new Date(), parseISO(startDate))
  return Math.min(Math.max(diff + 1, 1), TOTAL_DAYS)
}

export function getDayInfo(day) {
  const found = babyStepsContent.find((d) => d.day === day)
  if (found) return { ...found, isReinforcement: false }

  if (day === TOTAL_DAYS) {
    return {
      day,
      title: 'Você completou os Baby Steps! 🎉',
      description:
        'Esses hábitos agora são a base do seu dia a dia. Continue praticando e seja gentil consigo mesma — progresso, não perfeição.',
      isReinforcement: false,
    }
  }

  const learnedSoFar = babyStepsContent.filter((d) => d.day < day).map((d) => d.title)
  return {
    day,
    title: 'Dia de reforço',
    description: 'Sem hábito novo hoje — continue praticando o que você já aprendeu.',
    isReinforcement: true,
    learnedSoFar,
  }
}
