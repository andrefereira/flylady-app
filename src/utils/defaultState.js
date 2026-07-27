// Estado padrão criado para cada novo usuário no Firestore.
// Tudo aqui pode ser editado livremente pelo usuário dentro do app.

// Lista "de fábrica" das zonas e suas tarefas detalhadas. Exportado à parte
// para que a tela de Zonas possa oferecer um botão de "restaurar tarefas
// padrão" por zona, sem precisar duplicar essa lista.
export const defaultZones = [
  {
    id: 1,
    name: 'Entrada e Sala de Estar',
    tasks: [
      { id: 't1', label: 'Tirar o lixo e material reciclável' },
      { id: 't2', label: 'Tirar pó de móveis, prateleiras e quadros' },
      { id: 't3', label: 'Aspirar ou varrer o chão' },
      { id: 't4', label: 'Passar pano no chão' },
      { id: 't5', label: 'Organizar revistas, controles e objetos soltos' },
      { id: 't6', label: 'Limpar interruptores e maçanetas' },
      { id: 't7', label: 'Limpar vidros, espelhos e janelas' },
      { id: 't8', label: 'Sacudir tapetes e capachos' },
      { id: 't9', label: 'Organizar sapatos e casacos da entrada' },
      { id: 't10', label: 'Descartar correspondências e panfletos acumulados' },
    ],
    completedWeek: null,
    completedTasks: [],
    lastCleaned: null,
  },
  {
    id: 2,
    name: 'Cozinha',
    tasks: [
      { id: 't1', label: 'Limpar fogão, forno e coifa' },
      { id: 't2', label: 'Limpar bancadas e pia' },
      { id: 't3', label: 'Organizar e limpar a geladeira por dentro' },
      { id: 't4', label: 'Limpar por dentro do micro-ondas' },
      { id: 't5', label: 'Organizar armários e despensa' },
      { id: 't6', label: 'Lavar o chão' },
      { id: 't7', label: 'Limpar por fora os eletrodomésticos' },
      { id: 't8', label: 'Trocar pano de prato e esponja' },
      { id: 't9', label: 'Tirar o lixo e higienizar a lixeira' },
      { id: 't10', label: 'Organizar gaveta de talheres e utensílios' },
    ],
    completedWeek: null,
    completedTasks: [],
    lastCleaned: null,
  },
  {
    id: 3,
    name: 'Banheiro(s)',
    tasks: [
      { id: 't1', label: 'Limpar vaso sanitário por dentro e por fora' },
      { id: 't2', label: 'Limpar pia, torneira e espelho' },
      { id: 't3', label: 'Limpar box/banheira e ralo' },
      { id: 't4', label: 'Trocar as toalhas' },
      { id: 't5', label: 'Organizar armário e gavetas de produtos' },
      { id: 't6', label: 'Lavar o chão' },
      { id: 't7', label: 'Repor papel higiênico, sabonete e itens de uso' },
      { id: 't8', label: 'Limpar e trocar o saco do cesto de lixo' },
      { id: 't9', label: 'Verificar mofo em cortinas/rejuntes' },
      { id: 't10', label: 'Checar validade de produtos de higiene' },
    ],
    completedWeek: null,
    completedTasks: [],
    lastCleaned: null,
  },
  {
    id: 4,
    name: 'Quarto(s)',
    tasks: [
      { id: 't1', label: 'Trocar a roupa de cama' },
      { id: 't2', label: 'Organizar guarda-roupa (fora de estação, doações)' },
      { id: 't3', label: 'Tirar pó dos móveis e eletrônicos' },
      { id: 't4', label: 'Aspirar ou varrer o chão' },
      { id: 't5', label: 'Organizar a mesa de cabeceira' },
      { id: 't6', label: 'Organizar gavetas' },
      { id: 't7', label: 'Limpar espelhos' },
      { id: 't8', label: 'Arejar o quarto (abrir as janelas)' },
      { id: 't9', label: 'Organizar sapatos' },
      { id: 't10', label: 'Revisar itens embaixo da cama' },
    ],
    completedWeek: null,
    completedTasks: [],
    lastCleaned: null,
  },
  {
    id: 5,
    name: 'Escritório / Área Externa',
    tasks: [
      { id: 't1', label: 'Organizar papéis e documentos' },
      { id: 't2', label: 'Limpar mesa, teclado e eletrônicos' },
      { id: 't3', label: 'Organizar cabos e fios' },
      { id: 't4', label: 'Limpar varanda/quintal' },
      { id: 't5', label: 'Regar e cuidar das plantas' },
      { id: 't6', label: 'Organizar gavetas do escritório' },
      { id: 't7', label: 'Esvaziar a lixeira' },
      { id: 't8', label: 'Organizar materiais de escritório' },
      { id: 't9', label: 'Limpar vidros/portas da área externa' },
      { id: 't10', label: 'Varrer a área externa' },
    ],
    completedWeek: null,
    completedTasks: [],
    lastCleaned: null,
  },
]

const defaultState = {
  zones: defaultZones,
  routines: {
    morning: [
      { id: 'm1', label: 'Arrumar a cama' },
      { id: 'm2', label: 'Brilhar a pia da cozinha ✨' },
      { id: 'm3', label: 'Vestir-se e calçar sapatos' },
      { id: 'm4', label: 'Planejar o jantar' },
      { id: 'm5', label: 'Checar a agenda do dia' },
    ],
    evening: [
      { id: 'e1', label: 'Lavar a louça / esvaziar a lava-louças' },
      { id: 'e2', label: 'Brilhar a pia novamente ✨' },
      { id: 'e3', label: 'Separar a roupa de amanhã' },
      { id: 'e4', label: 'Arrumar a sala por 5 minutos' },
      { id: 'e5', label: 'Preparar bolsa/materiais do dia seguinte' },
    ],
    morningDone: {},
    eveningDone: {},
  },
  hotspots: [],
  decluttering: {
    challengeCount: 0,
    challengeGoal: 27,
    dailyDone: {},
    totalItemsRemoved: 0,
  },
  controlJournal: {
    notes: '',
    customChecklist: [],
  },
  history: [],
}

export default defaultState
