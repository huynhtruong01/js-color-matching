import { getTimerElement } from './selectors.js'

function shuffle(colorList) {
  if (!Array.isArray(colorList) || colorList.length <= 2) return

  for (let i = colorList.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * colorList.length)

    let temp = colorList[i]
    colorList[i] = colorList[j]
    colorList[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  if (count <= 0) return
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    const color = randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })

    colorList.push(color)
  }

  // double for each color
  const fullColorList = [...colorList, ...colorList]

  // shuffle color
  shuffle(fullColorList)

  return fullColorList
}

// show button
export function showButton(btn) {
  if (!btn) return 'Error'
  btn.classList.add('show')
}

// hide button
export function hideButton(btn) {
  if (!btn) return 'Error'
  btn.classList.remove('show')
}

// set text
export function setText(text) {
  const timerElement = getTimerElement()
  if (!timerElement) return

  timerElement.textContent = text
}
