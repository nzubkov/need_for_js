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
  speed: 5,
  traffic: 6,
  x: 0,
  y: 0
}

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1
}

function startGame() {
  start.classList.add('hide')
  score.style.top = '0px' //автоматически выставляется 88px, после рестарта игры, хотя у start display none
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
    enemy.speed = getRandomInt(2, setting.speed * 1.1) / 2
    enemy.style.left = Math.round(Math.random() * (gameArea.offsetWidth - 50) + enemy.offsetWidth) + 'px'
    enemy.style.top = enemy.y + 'px'
    
    
    enemy.style.background = setEnemyImage()
    gameArea.appendChild(enemy)
  }
  setting.score = 0
  setting.start = true
  gameArea.appendChild(car)
  car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2)
  car.style.bottom = '10px'
  car.style.top = 'auto'
  setting.x = car.offsetLeft
  setting.y = car.offsetTop
  requestAnimationFrame(playGame)
}

function setEnemyImage() {
  let enemyCarImageNumber = Math.round(Math.random()) === 1 ? 1 : 2
  return `transparent url(./image/enemy${enemyCarImageNumber}.png) center / cover no-repeat`
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
}

Object.preventExtensions(keys) //запрещаем модификацию keys

function playGame() {
  moveRoad()
  moveEnemy()
  if (setting.start) {
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
    let crush = (carRect.top <= enemyRect.bottom
      && carRect.right >= enemyRect.left
      && carRect.left <= enemyRect.right
      && carRect.bottom >= enemyRect.top)
    if(crush){
      setting.start = false
      start.classList.remove('hide')
      score.style.top = start.offsetHeight
      let record = getRecord()
      score.innerHTML += '<br> Рекорд игры: ' + record
      if(setting.score > record) {
        setRecord(setting.score)
        score.innerHTML += '<br> Поздравляем! Вы установили новый рекорд!'
      }
    }
    enemy.y += enemy.speed
    enemy.style.top = enemy.y + 'px'
    if(enemy.y >= document.documentElement.clientHeight) {
      enemy.y = -100 * setting.traffic
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'
      enemy.speed = getRandomInt(2, setting.speed * 1.5) / 2
      setting.score += setting.speed + enemy.speed * 10
      enemy.style.background = setEnemyImage()
    }
  })
}

function setRecord(score){
  window.localStorage.setItem('recordScore', score)
}

function getRecord(){
  let result = window.localStorage.getItem('recordScore')
  return result ? result : 0
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}