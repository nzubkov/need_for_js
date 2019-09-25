const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div')

car.classList.add('car')

start.addEventListener('click', startGame)
document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
  x: 0,
  y: 0
}

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1
}

function startGame() {
  start.style.display = 'none'
  gameArea.innerHTML = ''
  for(let i = 0; i < getQuantityElements(100); i++){
    const line = document.createElement('div')
    line.classList.add('line')
    line.style.top = (i * 100) + 'px'
    line.y = i * 100
    gameArea.appendChild(line)
  }
  
  for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
    const enemy = document.createElement('div')
    enemy.classList.add('enemy')
    enemy.y = -100 * setting.traffic * (i + 1)
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'
    enemy.style.top = enemy.y + 'px'
    enemy.style.background = "transparent url(./image/enemy2.png) center / cover no-repeat";
    gameArea.appendChild(enemy)
  }
  setting.score = 0
  setting.start = true
  gameArea.appendChild(car)
  setting.x = car.offsetLeft
  setting.y = car.offsetTop
  requestAnimationFrame(playGame)
}

function playGame() {
  moveRoad()
  moveEnemy()
  if (setting.start) {
    setting.score += setting.speed
    score.innerHTML = 'SCORE<br>' + setting.score
    if(keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed
    }
    if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed
    }
  
    if(keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed
    }
  
    if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed
    }
    
    car.style.left = setting.x + 'px'
    car.style.top = setting.y + 'px'

    requestAnimationFrame(playGame)
  }
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
}

function startRun(event) {
  event.preventDefault()
  keys[event.key] = true
}

function stopRun(event) {
  event.preventDefault()
  keys[event.key] = false
}

function moveRoad() {
  let lines = document.querySelectorAll('.line')
  lines.forEach(function(line) {
    line.y += setting.speed
    
    line.style.top = line.y + 'px'
  
    if(line.y >= document.documentElement.clientHeight) {
      line.y = -100
    }
  })
}

function moveEnemy() {
  let enemies = document.querySelectorAll('.enemy')
  enemies.forEach(function(enemy) {
    let carRect = car.getBoundingClientRect()
    let enemyRect = enemy.getBoundingClientRect()
    if(carRect.top <= enemyRect.bottom 
       && carRect.right >= enemyRect.left 
       && carRect.left <= enemyRect.right
       && carRect.bottom >= enemyRect.top) {
      setting.start = false
      start.style.display = 'block'
      score.style.top = start.offsetHeight
    }
    enemy.y += setting.speed / 2
  
    enemy.style.top = enemy.y + 'px'
  
    if(enemy.y >= document.documentElement.clientHeight) {
      enemy.y = -100 * setting.traffic
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'
    }
  })
}
