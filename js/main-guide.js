import { PAIRS_COUNT, GAME_STATUS, GAME_TIME } from './constants.js'
import {
  getColorElementList,
  getColorListElement,
  getColorBackground,
  getBtnAgainElement,
  getBtnStartElement,
  getTimerElement,
} from './selectors.js'
import { getRandomColorPairs, hideButton, setText, showButton } from './utils.js'

let selections = []
let gameStatus = GAME_STATUS.BLOCKING

function handleCheckWin() {
  const colorElementList = getColorElementList()
  if (colorElementList.length === 0) return 'Error'

  const colorNotActiveList = Array.from(colorElementList).filter(
    (color) => !color.classList.contains('active')
  )

  const isWin = colorNotActiveList.length === 0
  if (isWin) {
    // show button replay
    const btnReplayElement = getBtnAgainElement()
    const btnStartElement = getBtnStartElement()
    if (!btnReplayElement || !btnStartElement) return 'Error'
    showButton(btnReplayElement)
    hideButton(btnStartElement)

    // You win
    setText('You win🎉🎉')

    // finish game
    gameStatus = GAME_STATUS.FINISHED
  }
}

function handleColorClick(colorElement) {
  const isClicked = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  if (isClicked) return 'Error'
  colorElement.classList.add('active')

  // push color element
  selections.push(colorElement)

  // check selection < 2
  if (selections.length < 2) return 'Error'
  const firstElement = selections[0].dataset.color
  const secondElement = selections[1].dataset.color

  // check match
  const isMatch = firstElement === secondElement
  if (isMatch) {
    const colorBackgroundElement = getColorBackground()
    if (!colorBackgroundElement) return 'Error'
    colorBackgroundElement.style.backgroundColor = firstElement

    // check win
    handleCheckWin()
    selections = []
    return
  }

  gameStatus = GAME_STATUS.BLOCKING

  // otherwise all remove in selections
  setTimeout(() => {
    // remove class 'active'
    for (const li of selections) {
      li.classList.remove('active')
    }
    selections = []
    gameStatus = GAME_STATUS.PLAYING
  }, 500)
}

function attachEventColorClick() {
  const colorListElement = getColorListElement()
  if (!colorListElement) return 'Error'
  colorListElement.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return 'Error'
    handleColorClick(e.target)
  })
}

function initColors() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  // console.log(colorList)
  const colorElementList = getColorElementList()
  if (colorElementList.length === 0) return 'Error'

  // generate color
  colorList.forEach((color, index) => {
    colorElementList[index].dataset.color = color
    colorElementList[index].querySelector('.overlay').style.backgroundColor = color
  })
}

function handleReplayGame() {
  // reset timerElement
  setText('')

  // reset class active all color
  const colorElementList = getColorElementList()
  if (colorElementList.length === 0) return 'Error'
  for (const color of colorElementList) {
    color.classList.remove('active')
  }

  // hide button replay game
  const btnAgainElement = getBtnAgainElement()
  if (!btnAgainElement) return 'Error'
  hideButton(btnAgainElement)

  // show button start game
  const btnStartElement = getBtnStartElement()
  if (!btnStartElement) return
  showButton(btnStartElement)

  // reset color background
  const colorBackgroundElement = getColorBackground()
  if (!colorBackgroundElement) return 'Error'
  colorBackgroundElement.style.backgroundColor = 'goldenrod'

  // init new colors
  initColors()
}

function initReplay() {
  const btnReplayElement = getBtnAgainElement()
  if (!btnReplayElement) return 'Error'

  btnReplayElement.addEventListener('click', () => {
    handleReplayGame()
  })
}

function checkGameStatus() {
  const colorElementList = getColorElementList()
  if (colorElementList.length === 0) return

  // check win
  const isWin = Array.from(colorElementList).every((color) => color.classList.contains('active'))

  if (isWin) {
    return {
      status: 'win',
    }
  }

  return {
    status: 'lose',
  }
}

function handleCheckWinTimer() {
  const statusGame = checkGameStatus()

  // reset game status
  gameStatus = GAME_STATUS.FINISHED

  // set text
  const text = statusGame.status === 'win' ? 'You win 🎉🎉' : 'Game over 🤣🤣'
  setText(text)

  // show button play again
  const btnAgainElement = getBtnAgainElement()
  if (!btnAgainElement) return
  showButton(btnAgainElement)
}

function handleStartGame() {
  console.log('click')

  const btnStartGame = getBtnStartElement()
  if (!btnStartGame) return

  // hide button start
  hideButton(btnStartGame)

  // game status playing
  gameStatus = GAME_STATUS.PLAYING

  // set time
  setTimer()
}

function initStartGame() {
  const btnStartElement = getBtnStartElement()
  if (!btnStartElement) return

  btnStartElement.addEventListener('click', () => {
    handleStartGame()
  })
}

function setTimer() {
  let numberTimer = GAME_TIME
  const timer = setInterval(() => {
    const text = `0${numberTimer}`.slice(-2)
    setText(`${text}s`)
    numberTimer -= 1
    if (numberTimer < 0 || gameStatus === GAME_STATUS.FINISHED) {
      clearInterval(timer)
      handleCheckWinTimer()
    }
  }, 1000)
}

;(() => {
  // init colors
  initColors()

  // attach event click color
  attachEventColorClick()

  // init replay
  initReplay()

  // init start game
  initStartGame()
})()
