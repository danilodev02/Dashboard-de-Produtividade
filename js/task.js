const DAILY_MISSION_POOL = [
  {
    id: 'finish_all_daily_tasks',
    text: 'Concluir todas as tarefas diárias de hoje',
    reward: { xp: 50, coins: 20 }
  },
  {
    id: 'timer_25',
    text: 'Usar o temporizador por pelo menos 25 minutos',
    reward: { xp: 30, coins: 10 }
  },
  {
    id: 'focus_60',
    text: 'Manter o foco por 1 hora sem pausas',
    reward: { xp: 60, coins: 25 }
  }
]

let user = {
    xp: 0,
    coins: 0,
    focusTotal: 0
} 

function getTodayKey() {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

function generateDailyMissions() {
  const today = getTodayKey()

  return {
    date: today,
    missions: DAILY_MISSION_POOL.map(m => ({
      ...m,
      completed: false
    }))
  }
}

let dailyMissions = generateDailyMissions();

let mainTasks = []

function AdicionarTask(title, estimatedMinutes) {
  mainTasks.push({
    id: crypto.randomUUID(),
    title,
    estimatedMinutes,
    createdAt: Date.now(),
    completed: false,
    focusTime: 0
  })
}

function EditarTask(id, data) {
  const task = mainTasks.find(t => t.id === id)
  if (!task) return
  Object.assign(task, data)
  if (data && data.completed === true) {
    checkDailyMissions()
  }
}

function DeletarTask(id) {
  mainTasks = mainTasks.filter(t => t.id !== id)
  checkDailyMissions()
}

let activeTaskId = null
let focusStart = null

function startFocus(taskId) {
  activeTaskId = taskId
  focusStart = Date.now()
}

function stopFocus() {
  if (!activeTaskId || !focusStart) return

  const elapsed = Math.floor((Date.now() - focusStart) / 60000)
  const task = mainTasks.find(t => t.id === activeTaskId)

  if (task) {
    task.focusTime += elapsed
    user.focusTotal += elapsed
  }

  activeTaskId = null
  focusStart = null

  checkDailyMissions()
}

function checkDailyMissions() {
  dailyMissions.missions.forEach(mission => {
    if (mission.completed) return

    if (mission.id === 'timer_25' && user.focusTotal >= 25) {
      completeMission(mission)
    }

    if (mission.id === 'focus_60' && user.focusTotal >= 60) {
      completeMission(mission)
    }

    if (
      mission.id === 'finish_all_daily_tasks' &&
      mainTasks.length > 0 &&
      mainTasks.every(t => t.completed)
    ) {
      completeMission(mission)
    }
  })
}

function completeMission(mission) {
  mission.completed = true
  user.xp += mission.reward.xp
  user.coins += mission.reward.coins
}

