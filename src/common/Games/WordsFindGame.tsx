import './styles.scss'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  blackColor,
  BORDER_RADIUS,
  DEFAULT_PADDING,
  FONT_SIZE,
  greenColor,
  greyColor,
  LETTER_PADDING_X,
  LETTER_PADDING_Y,
  SECTION_PADDING,
  SQUARE_PADDING,
  SQUARE_SIZE,
  whiteColor,
} from '@/consts'
import { checkExistsCord, createWordMatrix, mouseMoveAlign } from '@/helpers'

type Props = {
  words: string[]
  rows: number
  cols: number
  setSuccess: (successWords: number) => void
}

type Cell = {
  row: number
  col: number
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

const isHorizontalValue = ['left', 'right']
const isVerticalValue = ['up', 'down']

const WordsFindGame = ({ words, rows, cols, setSuccess }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  const [successfulWordsCount, setSuccessfulWordsCount] = useState(0)

  let ctx: ICanvasRenderingContext2D

  let arrResult: string[] = []
  let arrResultCords: Cell[] = []
  let successfulCords: Cell[] = []
  let prevState = { col: -1, row: -1 }
  let state: Cell
  const sideBarBlock = document.querySelector('.sidebar-content')
  const blockWidth =
    (sideBarBlock &&
      sideBarBlock.getBoundingClientRect().width - SECTION_PADDING) ??
    0

  const canvasWidth =
    2 * DEFAULT_PADDING + (SQUARE_PADDING + SQUARE_SIZE) * cols

  const resizeGameRatio = useMemo(() => {
    const ratio = blockWidth / canvasWidth
    return ratio >= 1 ? 2 : 2 * ratio
  }, [canvasWidth, blockWidth])

  const squareSize = useMemo(() => {
    return SQUARE_SIZE * resizeGameRatio
  }, [resizeGameRatio])

  const squarePadding = useMemo(() => {
    return SQUARE_PADDING * resizeGameRatio
  }, [resizeGameRatio])

  const defaultPadding = useMemo(() => {
    return DEFAULT_PADDING * resizeGameRatio
  }, [resizeGameRatio])

  const letterPaddingX = useMemo(() => {
    return LETTER_PADDING_X * resizeGameRatio
  }, [resizeGameRatio])

  const letterPaddingY = useMemo(() => {
    return LETTER_PADDING_Y * resizeGameRatio
  }, [resizeGameRatio])

  const width = useMemo(() => {
    return blockWidth < canvasWidth ? 2 * blockWidth : 2 * canvasWidth
  }, [blockWidth, canvasWidth])

  const height = useMemo(() => {
    return (
      2 *
      ((2 * DEFAULT_PADDING + (SQUARE_PADDING + SQUARE_SIZE) * rows) *
        resizeGameRatio)
    )
  }, [rows, resizeGameRatio])

  const matrix = useMemo(() => {
    return createWordMatrix(words, rows, cols)
  }, [words, cols, rows])

  const fillActiveSquare = (event: MouseEvent) => {
    const col = Math.trunc(
      (event.offsetX - defaultPadding) / ((squareSize + squarePadding) / 2),
    )
    const row = Math.trunc(
      (event.offsetY - defaultPadding) / ((squareSize + squarePadding) / 2),
    )
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
            (prevState.col - 1) * squarePadding,
          defaultPadding +
            prevState.row * squareSize +
            (prevState.row - 1) * squarePadding,
          checkExistsCord(prevState.row, prevState.col, successfulCords)
            ? 0
            : squareSize + 2 * squarePadding,
          checkExistsCord(prevState.row, prevState.col, successfulCords)
            ? 0
            : squareSize + 2 * squarePadding,
        )
        ctx.fillStyle = greyColor
        ctx
          .roundRect(
            defaultPadding +
              prevState.col * squareSize +
              prevState.col * squarePadding,
            defaultPadding +
              prevState.row * squareSize +
              prevState.row * squarePadding,
            squareSize,
            squareSize,
            BORDER_RADIUS,
          )
          .fill()
        ctx.fillStyle = whiteColor
        ctx.fillText(
          matrix[prevState.row][prevState.col],
          defaultPadding +
            letterPaddingX +
            prevState.col * squareSize +
            prevState.col * squarePadding,
          defaultPadding +
            letterPaddingY +
            prevState.row * squareSize +
            prevState.row * squarePadding,
        )
      }
      const el = arrResultCords.findIndex(
        obj => obj.row === prevState.row && obj.col === prevState.col,
      )
      arrResult.splice(el, 1)
      arrResultCords.splice(el, 1)
      prevState = state
      return
    } else if (!checkExistsCord(row, col, successfulCords)) {
      ctx.fillStyle = greenColor
      const direction = mouseMoveAlign(prevState, state)
      ctx.fillRect(
        isVerticalValue.includes(direction)
          ? defaultPadding +
              col * squareSize +
              (col + (direction === 'down' ? -1 : 0)) * squarePadding
          : defaultPadding + col * squareSize + col * squarePadding,
        isHorizontalValue.includes(direction)
          ? defaultPadding +
              row * squareSize +
              (row + (direction === 'right' ? -1 : 0)) * squarePadding
          : defaultPadding + row * squareSize + row * squarePadding,
        isVerticalValue.includes(direction)
          ? squareSize + squarePadding
          : squareSize,
        isHorizontalValue.includes(direction)
          ? squareSize + squarePadding
          : squareSize,
      )
    }

    ctx.fillStyle = whiteColor
    ctx.fillText(
      matrix[row][col],
      defaultPadding + letterPaddingX + col * squareSize + col * squarePadding,
      defaultPadding + letterPaddingY + row * squareSize + row * squarePadding,
    )
    prevState = state
    arrResult.push(matrix[row][col])
    arrResultCords.push({ col, row })
  }

  const checkResult = () => {
    const resultWord = arrResult.join('').toLowerCase()
    if (words.includes(resultWord)) {
      successfulCords = successfulCords.concat(arrResultCords)
      setSuccessfulWordsCount(prevState => prevState + 1)
      return true
    }
    return false
  }

  const clear = () => {
    canvasRef.current?.removeEventListener('mousemove', fillActiveSquare)
    if (!checkResult()) {
      for (const item of arrResultCords) {
        ctx.fillStyle = blackColor
        ctx.fillRect(
          defaultPadding +
            item.col * squareSize +
            (item.col - 1) * squarePadding,
          defaultPadding +
            item.row * squareSize +
            (item.row - 1) * squarePadding,
          checkExistsCord(item.row, item.col, successfulCords)
            ? 0
            : squareSize + 2 * squarePadding,
          checkExistsCord(item.row, item.col, successfulCords)
            ? 0
            : squareSize + 2 * squarePadding,
        )
        ctx.fillStyle = greyColor
        ctx
          .roundRect(
            defaultPadding + item.col * squareSize + item.col * squarePadding,
            defaultPadding + item.row * squareSize + item.row * squarePadding,
            squareSize,
            squareSize,
            BORDER_RADIUS,
          )
          .fill()
        if (checkExistsCord(item.row, item.col, successfulCords)) {
          ctx.fillStyle = greenColor
          ctx
            .roundRect(
              defaultPadding + item.col * squareSize + item.col * squarePadding,
              defaultPadding + item.row * squareSize + item.row * squarePadding,
              squareSize,
              squareSize,
              BORDER_RADIUS,
            )
            .fill()
        }
        ctx.fillStyle = '#FFF'
        ctx.fillText(
          matrix[item.row][item.col],
          defaultPadding +
            letterPaddingX +
            item.col * squareSize +
            item.col * squarePadding,
          defaultPadding +
            letterPaddingY +
            item.row * squareSize +
            item.row * squarePadding,
        )
      }
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

  useEffect(() => {
    if (canvasRef.current && matrix.length && matrix[0].length) {
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
      canvas.style.width = `${width / 2}px`
      canvas.style.height = `${height / 2}px`
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ctx = canvas.getContext('2d') as ICanvasRenderingContext2D
      ctx.fillStyle = blackColor
      ctx?.fillRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE * resizeGameRatio}px Euclid Circular B`
      ctx.textAlign = 'center'
      for (let col = 0; col < matrix.length; col += 1)
        for (let row = 0; row < matrix[col].length; row += 1) {
          ctx.fillStyle = '#2B2B2B'
          ctx.strokeStyle = ctx.fillStyle
          ctx
            .roundRect(
              defaultPadding + row * squareSize + row * squarePadding,
              defaultPadding + col * squareSize + col * squarePadding,
              squareSize,
              squareSize,
              squarePadding,
            )
            .fill()
          ctx.fillStyle = '#FFF'
          ctx.fillText(
            matrix[col][row],
            defaultPadding +
              LETTER_PADDING_X * resizeGameRatio +
              row * squareSize +
              row * squarePadding,
            defaultPadding +
              LETTER_PADDING_Y * resizeGameRatio +
              col * squareSize +
              col * squarePadding,
          )
        }
      canvas?.addEventListener('mousedown', mouseDownHandler)

      return () => canvas?.removeEventListener('mousedown', mouseDownHandler)
    }
  }, [])

  useEffect(() => {
    setSuccess(successfulWordsCount)
  }, [setSuccess, successfulWordsCount])

  return (
    <div className='word-find-game'>
      <p className='word-find-game__text'>
        {'Interactive game during the wait time'}
      </p>
      <canvas ref={canvasRef} height={height} width={width} />
    </div>
  )
}

export default WordsFindGame
