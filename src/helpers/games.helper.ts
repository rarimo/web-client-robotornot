type Cell = {
  row: number
  col: number
}

export function createWordMatrix(
  words: string[],
  rows: number,
  columns: number,
): string[][] {
  const matrix: string[][] = new Array(rows)
    .fill(null)
    .map(() => new Array(columns).fill(null))

  const getRandomDirection = (): string => {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical'
  }

  const canPlaceWord = (
    word: string,
    row: number,
    col: number,
    direction: string,
  ) => {
    if (direction === 'horizontal') {
      return col + word.length <= columns
    } else {
      return row + word.length <= rows
    }
  }

  const placeWord = (
    word: string,
    row: number,
    col: number,
    direction: string,
  ) => {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        matrix[row][col + i] = word[i].toUpperCase()
      } else {
        matrix[row + i][col] = word[i].toUpperCase()
      }
    }
  }

  for (const word of words) {
    let placed = false
    while (!placed) {
      const direction = getRandomDirection()
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * columns)

      if (canPlaceWord(word, row, col, direction)) {
        let hasCommonLetter = false

        if (direction === 'horizontal') {
          for (let i = 0; i < word.length; i++) {
            const matrixValue = matrix[row][col + i]
            const wordValue = word[i].toUpperCase()
            if (matrixValue !== null && matrixValue !== wordValue) {
              hasCommonLetter = true
              break
            }
          }
        } else {
          for (let i = 0; i < word.length; i++) {
            const matrixValue = matrix[row + i][col]
            const wordValue = word[i].toUpperCase()
            if (matrixValue !== null && matrixValue !== wordValue) {
              hasCommonLetter = true
              break
            }
          }
        }

        if (!hasCommonLetter) {
          placeWord(word, row, col, direction)
          placed = true
        }
      }
    }
  }

  const alphabet = '.'
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (matrix[row][col] === null) {
        const randomIndex = Math.floor(Math.random() * alphabet.length)
        matrix[row][col] = alphabet[randomIndex]
      }
    }
  }

  return matrix
}

export const checkExistsCord = (
  row: number,
  col: number,
  arrCord: Cell[],
): boolean => {
  for (const item of arrCord) {
    if (row === item.row && col === item.col) {
      return true
    }
  }
  return false
}

export const mouseMoveAlign = (prevState: Cell, state: Cell) => {
  if (prevState.col === -1 && prevState.row === -1) return 'default'
  if (prevState.row !== state.row) {
    if (prevState.row > state.row) {
      return 'left'
    } else {
      return 'right'
    }
  } else if (prevState.col !== state.col) {
    if (prevState.col > state.col) {
      return 'up'
    } else {
      return 'down'
    }
  }
  return 'default'
}
