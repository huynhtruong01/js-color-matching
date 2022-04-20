import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getBtnAgainElement,
  getBtnStartElement,
  getColorBackground,
  getColorElementList,
  getColorListElement,
  getTimerElement,
} from './selectors.js'
import { getRandomColorPairs } from './utils.js'

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

let twoColorCheckList = []
let positionList = []
let isStartGame = false

// show button
function showBtnElement(btnElement) {
  if (!btnElement) return
  btnElement.classList.add('show')
}

// hide button
function hideBtnElement(btnElement) {
  if (!btnElement) return
  btnElement.classList.remove('show')
}

// check status game
function checkStatusGame() {
  const colorElementList = getColorElementList()
  const timerElement = getTimerElement()
  if (colorElementList.length === 0 || !timerElement) return

  const isWinner = Array.from(colorElementList).every((color) => color.classList.contains('active'))

  if (isWinner) {
    timerElement.textContent = 'You win'
    return
  }

  timerElement.textContent = 'You lose'
}

// reset game
function gameOver() {
  const btnAgainElement = getBtnAgainElement()
  const timerElement = getTimerElement()
  const colorElementList = getColorElementList()

  if (!btnAgainElement || !timerElement || colorElementList.length === 0) return
  // show button again
  showBtnElement(btnAgainElement)
  // reset isStartGame = false
  isStartGame = false

  // check status game
  checkStatusGame()
}

// start timer
function startTimer(timerElement) {
  let time = GAME_TIME
  let startGame = setInterval(() => {
    timerElement.textContent = `${time}s`
    time -= 1

    if (time < 0) {
      clearInterval(startGame)
      gameOver()
    }
  }, 1000)
}

function handleColorClick(colorElement) {
  if (!colorElement) return
  const colorBackground = getColorBackground()
  const colorElementList = getColorElementList()
  if (colorElementList.length === 0) return
  if (!colorBackground) return

  const isClicked = colorElement.classList.contains('active')
  // when game isn't start game
  if (!isStartGame || isClicked) return

  // click add active
  colorElement.classList.add('active')
  const colorValue = colorElement.dataset.color
  twoColorCheckList.push(colorValue)
  positionList.push(Number.parseInt(colorElement.dataset.idx))
  // check logic when 2 elements equal
  console.log(twoColorCheckList, positionList)
  if (twoColorCheckList.length !== 2) return
  const isEqualColor = twoColorCheckList.every((color) => color === twoColorCheckList[0])

  console.log(isEqualColor)
  if (isEqualColor) {
    // when 2 elements equal bg change with color of 2 elements
    colorBackground.style.backgroundColor = twoColorCheckList[0]
    twoColorCheckList = []
    positionList = []
    return
  }
  setTimeout(() => {
    for (const idx of positionList) {
      colorElementList[idx].classList.remove('active')
    }
    twoColorCheckList = []
    positionList = []
  }, 500)
}

function initGame() {
  const colorListElement = getColorListElement()
  const colorElementList = getColorElementList()
  if (colorElementList.length === 0) return
  if (!colorListElement) return

  const colorList = getRandomColorPairs(PAIRS_COUNT)

  for (let i = 0; i < colorList.length; i++) {
    colorElementList[i].dataset.color = colorList[i]
    colorElementList[i].dataset.idx = i
    colorElementList[i].querySelector('.overlay').style.backgroundColor = colorList[i]
  }

  colorListElement.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return
    handleColorClick(e.target)
  })
}

function handleStartGame(btnStart) {
  const timerElement = getTimerElement()
  if (!timerElement) return

  // isStartGame = true
  isStartGame = true
  // show setInterval 30s
  startTimer(timerElement)
  // hide btn start game
  hideBtnElement(btnStart)
}

function handlePlayAgain(btnAgainElement) {
  // hide button again
  hideBtnElement(btnAgainElement)

  // remove class active each color
  const colorElementList = getColorElementList()
  if (colorElementList.length === 0) return
  for (const color of colorElementList) {
    color.className = ''
  }

  // show button start
  const btnStartElement = getBtnStartElement()
  if (!btnStartElement) return
  showBtnElement(btnStartElement)

  // reset game background
  const colorBackgroundElement = getColorBackground()
  if (!colorBackgroundElement) return
  colorBackgroundElement.style.backgroundColor = 'goldenrod'

  // reset timer
  const timerElement = getTimerElement()
  if (!timerElement) return
  timerElement.textContent = ''
}

function initStartGame() {
  const btnStartGame = getBtnStartElement()
  if (!btnStartGame) return

  btnStartGame.addEventListener('click', (e) => handleStartGame(e.currentTarget))
}

function initPlayAgain() {
  const btnAgainElement = getBtnAgainElement()

  if (!btnAgainElement) return

  btnAgainElement.addEventListener('click', (e) => handlePlayAgain(e.currentTarget))
}

;(() => {
  initGame()
  initStartGame()
  initPlayAgain()
})()
