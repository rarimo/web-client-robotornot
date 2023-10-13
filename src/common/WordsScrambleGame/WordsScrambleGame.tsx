import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

import { checkExistsCord, createWordMatrix, mouseMoveAlign } from './helpers'

type Props = {
  words: string[]
  rows: number
  cols: number
  onStatusGameUpdated: (status: { found: number }) => void
} & MotionProps &
  HTMLAttributes<HTMLDivElement>

type Cell = {
  row: number
  col: number
  color?: number
  align?: string
}

interface ICanvasRenderingContext2D extends CanvasRenderingContext2D {
  roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: number,
  ): CanvasRenderingContext2D
}

const SQUARE_SIZE = 44
const GAP = 8
const DEFAULT_PADDING = 32
const DEFAULT_PADDING_VERTICAL = 32
const BORDER_RADIUS = 8
const greenColor = 'rgba(44,167,75,0.5)'
const greyColor = '#2b2b2b'
const blackColor = '#000'
const whiteColor = '#fff'
const LETTER_PADDING_X = 20
const LETTER_PADDING_Y = 30
const FONT_SIZE = 24
const SECTION_TOP_PADDING = 168
const successColors: string[] = [
  'rgba(122, 83, 171, 0.6)',
  'rgba(48,68,254,0.6)',
  'rgba(255,121,85,0.6)',
  'rgba(44,167,75,0.5)',
  'rgba(250,217,2,0.65)',
  'rgba(91, 241, 205, 0.6)',
]
const isHorizontalValue = ['left', 'right']
const isVerticalValue = ['up', 'down']

const WordsScrambleGame = ({
  words,
  rows,
  cols,
  className,
  onStatusGameUpdated,
  ...rest
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)

  const [successfulWordsCount, setSuccessfulWordsCount] = useState(0)
  const [blockWidth, setBlockWidth] = useState(0)
  const [blockHeight, setBlockHeight] = useState(0)

  let ctx: ICanvasRenderingContext2D

  let arrResult: string[] = []
  let arrResultCords: Cell[] = []
  let successfulCords: Cell[] = []
  let prevState = { col: -1, row: -1 }
  let state: Cell
  const remainingWords = [...words]

  let sideBarBlock: HTMLDivElement | null
  let successfulWordsColorNumber = 0

  const canvasWidth =
    2 * DEFAULT_PADDING + GAP * (cols - 1) + SQUARE_SIZE * cols

  const canvasHeight =
    2 * DEFAULT_PADDING_VERTICAL + GAP * (rows - 1) + SQUARE_SIZE * rows

  const resizeGameRatio = useMemo(() => {
    const ratioWidth = blockWidth / canvasWidth
    const ratioHeight = blockHeight / canvasHeight
    return ratioWidth >= ratioHeight ? 2 * ratioHeight : 2 * ratioWidth
  }, [blockHeight, blockWidth, canvasHeight, canvasWidth])

  const squareSize = useMemo(() => {
    return SQUARE_SIZE * resizeGameRatio
  }, [resizeGameRatio])

  const gap = useMemo(() => {
    return GAP * resizeGameRatio
  }, [resizeGameRatio])

  const defaultPadding = useMemo(() => {
    return DEFAULT_PADDING * resizeGameRatio
  }, [resizeGameRatio])

  const defaultPaddingVertical = useMemo(() => {
    return DEFAULT_PADDING_VERTICAL * resizeGameRatio
  }, [resizeGameRatio])

  const letterPaddingX = useMemo(() => {
    return LETTER_PADDING_X * resizeGameRatio
  }, [resizeGameRatio])

  const letterPaddingY = useMemo(() => {
    return LETTER_PADDING_Y * resizeGameRatio
  }, [resizeGameRatio])

  const width = useMemo(() => {
    return canvasWidth * resizeGameRatio
  }, [canvasWidth, resizeGameRatio])

  const height = useMemo(() => {
    return canvasHeight * resizeGameRatio
  }, [canvasHeight, resizeGameRatio])

  const matrix = useMemo(() => {
    return createWordMatrix(words, rows, cols)
  }, [words, cols, rows])

  const printLetter = (col: number, row: number) => {
    ctx.fillStyle = whiteColor
    ctx.fillText(
      matrix[row][col],
      defaultPadding + letterPaddingX + col * squareSize + col * gap,
      defaultPaddingVertical + letterPaddingY + row * squareSize + row * gap,
    )
  }

  const fillActiveSquare = (event: MouseEvent) => {
    const col = Math.trunc(
      (event.offsetX - defaultPadding / 2) / ((squareSize + gap) / 2),
    )
    const row = Math.trunc(
      (event.offsetY - defaultPaddingVertical / 2) / ((squareSize + gap) / 2),
    )
    let direction = 'default'

    if (col === cols || row === rows) return
    state = { row, col }
    if (state.row === prevState.row && state.col === prevState.col) return

    if (
      checkExistsCord(row, col, arrResultCords) &&
      arrResultCords.length > 1
    ) {
      if (!checkExistsCord(prevState.row, prevState.col, successfulCords)) {
        ctx.fillStyle = blackColor
        ctx.fillRect(
          defaultPadding +
            prevState.col * squareSize +
            (prevState.col - 1) * gap,
          defaultPadding +
            prevState.row * squareSize +
            (prevState.row - 1) * gap,
          checkExistsCord(prevState.row, prevState.col, successfulCords)
            ? 0
            : squareSize + 2 * gap,
          checkExistsCord(prevState.row, prevState.col, successfulCords)
            ? 0
            : squareSize + 2 * gap,
        )
        ctx.fillStyle = greyColor
        ctx
          .roundRect(
            defaultPadding + prevState.col * squareSize + prevState.col * gap,
            defaultPaddingVertical +
              prevState.row * squareSize +
              prevState.row * gap,
            squareSize,
            squareSize,
            BORDER_RADIUS,
          )
          .fill()
        printLetter(prevState.col, prevState.row)
      }
      const el = arrResultCords.findIndex(
        obj => obj.row === prevState.row && obj.col === prevState.col,
      )
      arrResult.splice(el, 1)
      arrResultCords.splice(el, 1)
      prevState = state
      return
    } else {
      ctx.fillStyle = blackColor
      ctx.fillRect(
        defaultPadding + col * squareSize + (col - 1) * gap,
        defaultPadding + row * squareSize + (row - 1) * gap,
        checkExistsCord(row, col, successfulCords) ? 0 : squareSize + 2 * gap,
        checkExistsCord(row, col, successfulCords) ? 0 : squareSize + 2 * gap,
      )
      ctx.fillStyle = greyColor
      ctx
        .roundRect(
          defaultPadding + col * squareSize + col * gap,
          defaultPaddingVertical + row * squareSize + row * gap,
          squareSize,
          squareSize,
          BORDER_RADIUS,
        )
        .fill()
      ctx.fillStyle = greenColor
      direction = mouseMoveAlign(prevState, state)
      ctx.fillRect(
        isVerticalValue.includes(direction)
          ? defaultPadding +
              col * squareSize +
              (col + (direction === 'down' ? -1 : 0)) * gap
          : defaultPadding + col * squareSize + col * gap,
        isHorizontalValue.includes(direction)
          ? defaultPaddingVertical +
              row * squareSize +
              (row + (direction === 'right' ? -1 : 0)) * gap
          : defaultPaddingVertical + row * squareSize + row * gap,
        isVerticalValue.includes(direction) ? squareSize + gap : squareSize,
        isHorizontalValue.includes(direction) ? squareSize + gap : squareSize,
      )
    }
    printLetter(col, row)
    prevState = state
    arrResult.push(matrix[row][col])
    arrResultCords.push({
      col,
      row,
      color: successfulWordsColorNumber,
      align: direction,
    })
  }

  const checkResult = () => {
    const resultWord = arrResult.join('').toLowerCase()
    const resultWordIndex = remainingWords.findIndex(el => el === resultWord)
    if (resultWordIndex !== -1) {
      remainingWords.splice(resultWordIndex, 1)
      successfulCords = successfulCords.concat(arrResultCords)

      const successfulWords = successfulWordsCount + 1

      setSuccessfulWordsCount(successfulWords)

      onStatusGameUpdated({
        found: successfulWords,
      })
      return true
    }
    return false
  }

  const clear = () => {
    canvasRef.current?.removeEventListener('mousemove', fillActiveSquare)
    if (!checkResult()) {
      for (const item of arrResultCords) {
        if (checkExistsCord(item.row, item.col, successfulCords)) {
          const square = successfulCords.find(
            obj => obj.row === item.row && obj.col === item.col,
          )

          const direction = square?.align ?? 'default'

          ctx.fillStyle = successColors[square?.color ?? 0]
          ctx.fillRect(
            isVerticalValue.includes(direction)
              ? defaultPadding +
                  item.col * squareSize +
                  (item.col + (direction === 'down' ? -1 : 0)) * gap
              : defaultPadding + item.col * squareSize + item.col * gap,
            isHorizontalValue.includes(direction)
              ? defaultPaddingVertical +
                  item.row * squareSize +
                  (item.row + (direction === 'right' ? -1 : 0)) * gap
              : defaultPaddingVertical + item.row * squareSize + item.row * gap,
            isVerticalValue.includes(direction) ? squareSize + gap : squareSize,
            isHorizontalValue.includes(direction)
              ? squareSize + gap
              : squareSize,
          )
        } else {
          ctx.fillStyle = blackColor
          ctx.fillRect(
            defaultPadding + item.col * squareSize + (item.col - 1) * gap,
            defaultPaddingVertical +
              item.row * squareSize +
              (item.row - 1) * gap,
            checkExistsCord(item.row, item.col, successfulCords)
              ? 0
              : squareSize + 2 * gap,
            checkExistsCord(item.row, item.col, successfulCords)
              ? 0
              : squareSize + 2 * gap,
          )
          ctx.fillStyle = greyColor
          ctx
            .roundRect(
              defaultPadding + item.col * squareSize + item.col * gap,
              defaultPaddingVertical + item.row * squareSize + item.row * gap,
              squareSize,
              squareSize,
              BORDER_RADIUS,
            )
            .fill()
        }
        printLetter(item.col, item.row)
      }
    } else {
      let localPrevState = { col: -1, row: -1 }
      for (const { col, row } of arrResultCords) {
        ctx.fillStyle = successColors[successfulWordsColorNumber]
        const direction = mouseMoveAlign(localPrevState, { col, row })
        ctx.fillRect(
          isVerticalValue.includes(direction)
            ? defaultPadding +
                col * squareSize +
                (col + (direction === 'down' ? -1 : 0)) * gap
            : defaultPadding + col * squareSize + col * gap,
          isHorizontalValue.includes(direction)
            ? defaultPaddingVertical +
                row * squareSize +
                (row + (direction === 'right' ? -1 : 0)) * gap
            : defaultPaddingVertical + row * squareSize + row * gap,
          isVerticalValue.includes(direction) ? squareSize + gap : squareSize,
          isHorizontalValue.includes(direction) ? squareSize + gap : squareSize,
        )
        printLetter(col, row)
        localPrevState = { col, row }
      }
      successfulWordsColorNumber =
        successfulWordsColorNumber + 1 >= successColors.length
          ? 0
          : successfulWordsColorNumber + 1
    }
    arrResult = []
    arrResultCords = []
    prevState = { col: -1, row: -1 }
  }

  const mouseDownHandler = () => {
    canvasRef.current?.addEventListener('mousemove', fillActiveSquare)
    canvasRef.current?.addEventListener('mouseup', () => {
      clear()
    })
  }

  const initGame = () => {
    sideBarBlock = document.querySelector('.word-find-game')
    setBlockWidth(sideBarBlock ? sideBarBlock.getBoundingClientRect().width : 0)
    setBlockHeight(
      sideBarBlock
        ? sideBarBlock.getBoundingClientRect().height - SECTION_TOP_PADDING
        : 0,
    )
    CanvasRenderingContext2D.prototype.roundRect = function (
      x,
      y,
      width,
      height,
      radius?: number,
    ): CanvasRenderingContext2D {
      if (!radius) radius = 0
      if (width < 2 * radius) radius = width / 2
      if (height < 2 * radius) radius = height / 2
      this.beginPath()
      this.moveTo(x + radius, y)
      this.arcTo(x + width, y, x + width, y + height, radius)
      this.arcTo(x + width, y + height, x, y + height, radius)
      this.arcTo(x, y + height, x, y, radius)
      this.arcTo(x, y, x + width, y, radius)
      this.closePath()
      return this
    }
    const canvas = canvasRef.current
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width / 2}px`
    canvas.style.height = `${height / 2}px`
    ctx = canvas.getContext('2d') as ICanvasRenderingContext2D
    ctx.fillStyle = blackColor
    ctx?.fillRect(0, 0, width, height)
    ctx.font = `${FONT_SIZE * resizeGameRatio}px euclidCircularB`
    ctx.textAlign = 'center'
    for (let col = 0; col < matrix.length; col += 1)
      for (let row = 0; row < matrix[col].length; row += 1) {
        ctx.fillStyle = '#2B2B2B'
        ctx.strokeStyle = ctx.fillStyle
        ctx
          .roundRect(
            defaultPadding + row * squareSize + row * gap,
            defaultPaddingVertical + col * squareSize + col * gap,
            squareSize,
            squareSize,
            gap,
          )
          .fill()
        printLetter(row, col)
      }
    canvas?.addEventListener('mousedown', mouseDownHandler)
    return canvas
  }

  useEffect(() => {
    if (canvasRef.current && matrix.length && matrix[0].length) {
      const canvas = initGame()
      return () => canvas?.removeEventListener('mousedown', mouseDownHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, resizeGameRatio])

  return (
    <motion.div
      className={['words-scramble-game', className].join(' ')}
      {...rest}
    >
      <canvas
        className='words-scramble-game__canvas'
        ref={canvasRef}
        height={height}
        width={width}
      />
    </motion.div>
  )
}

export default WordsScrambleGame
