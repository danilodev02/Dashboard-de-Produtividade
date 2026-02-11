const assert = require('node:assert/strict')

const task = require('../js/task.js')

if (!global.crypto) {
  let counter = 0
  global.crypto = {
    randomUUID() {
      counter += 1
      return `test-uuid-${counter}`
    }
  }
}

function test(name, fn) {
  try {
    task.__resetState()
    fn()
    console.log(`ok - ${name}`)
  } catch (err) {
    console.error(`fail - ${name}`)
    console.error(err)
    process.exitCode = 1
  }
}

function withMockedNow(values, fn) {
  const originalNow = Date.now
  let i = 0
  Date.now = () => values[Math.min(i++, values.length - 1)]
  try {
    fn()
  } finally {
    Date.now = originalNow
  }
}

test('generateDailyMissions cria missoes nao completadas e data de hoje', () => {
  const missions = task.generateDailyMissions()
  const today = task.getTodayKey()

  assert.equal(missions.date, today)
  assert.equal(missions.missions.length, task.DAILY_MISSION_POOL.length)
  missions.missions.forEach(m => {
    assert.equal(m.completed, false)
  })
})

test('Adicionar/Editar/Deletar task', () => {
  task.AdicionarTask('Estudar', 30)
  let state = task.getState()
  assert.equal(state.mainTasks.length, 1)
  const id = state.mainTasks[0].id

  task.EditarTask(id, { completed: true, title: 'Estudar JS' })
  state = task.getState()
  assert.equal(state.mainTasks[0].completed, true)
  assert.equal(state.mainTasks[0].title, 'Estudar JS')

  task.DeletarTask(id)
  state = task.getState()
  assert.equal(state.mainTasks.length, 0)
})

test('stopFocus acumula tempo de foco e recompensa missao timer_25', () => {
  task.AdicionarTask('Focar', 25)
  const id = task.getState().mainTasks[0].id

  withMockedNow([1, 1 + 25 * 60 * 1000], () => {
    task.startFocus(id)
    task.stopFocus()
  })

  const state = task.getState()
  assert.equal(state.user.focusTotal, 25)
  assert.equal(state.user.xp, 30)
  assert.equal(state.user.coins, 10)
  const mission = state.dailyMissions.missions.find(m => m.id === 'timer_25')
  assert.equal(mission.completed, true)
})

test('missao focus_60 e concluida com 60 minutos', () => {
  task.AdicionarTask('Focar mais', 60)
  const id = task.getState().mainTasks[0].id

  withMockedNow([1, 1 + 60 * 60 * 1000], () => {
    task.startFocus(id)
    task.stopFocus()
  })

  const state = task.getState()
  const mission = state.dailyMissions.missions.find(m => m.id === 'focus_60')
  assert.equal(mission.completed, true)
})

test('missao finish_all_daily_tasks completa quando todas concluidas', () => {
  task.AdicionarTask('A', 10)
  task.AdicionarTask('B', 10)
  const stateBefore = task.getState()
  stateBefore.mainTasks.forEach(t => task.EditarTask(t.id, { completed: true }))

  task.checkDailyMissions()

  const state = task.getState()
  const mission = state.dailyMissions.missions.find(m => m.id === 'finish_all_daily_tasks')
  assert.equal(mission.completed, true)
  assert.equal(state.user.xp, 50)
  assert.equal(state.user.coins, 20)
})
