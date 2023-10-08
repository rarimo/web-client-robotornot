import './styles.scss'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  blackColor,
  BORDER_RADIUS,
  DEFAULT_PADDING,
  greenColor,
  greyColor,
  SQUARE_PADDING,
  SQUARE_SIZE,
  whiteColor,
} from '@/consts'
import { checkExistsCord, createWordMatrix, mouseMoveAlign } from '@/helpers'

type Props = {
  words: string[]
  rows: number
  cols: number
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

const WordsFindGame = ({ words, rows, cols }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  const [successfulWordsCount, setSuccessfulWordsCount] = useState(0)

  let ctx: ICanvasRenderingContext2D

  let arrResult: string[] = []
  let arrResultCords: Cell[] = []
  let successfulCords: Cell[] = []
  let prevState = { col: -1, row: -1 }
  let state: Cell

  const isHorizontalValue = ['left', 'right']
  const isVerticalValue = ['up', 'down']

  const width = useMemo(() => {
    return 2 * DEFAULT_PADDING + (SQUARE_PADDING + SQUARE_SIZE) * cols
  }, [cols])

  const height = useMemo(() => {
    return 2 * DEFAULT_PADDING + (SQUARE_PADDING + SQUARE_SIZE) * rows
  }, [rows])

  const matrix = useMemo(() => {
    return createWordMatrix(words, rows, cols)
  }, [words, cols, rows])

  const fillActiveSquare = (event: MouseEvent) => {
    const row = Math.trunc(
      (event.offsetX - DEFAULT_PADDING) / (SQUARE_SIZE + SQUARE_PADDING),
    )
    const col = Math.trunc(
      (event.offsetY - DEFAULT_PADDING) / (SQUARE_SIZE + SQUARE_PADDING),
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
        // console.log(...arrResultCords)
        ctx.fillRect(
          DEFAULT_PADDING +
            prevState.row * SQUARE_SIZE +
            (prevState.row - 1) * SQUARE_PADDING,
          DEFAULT_PADDING +
            prevState.col * SQUARE_SIZE +
            (prevState.col - 1) * SQUARE_PADDING,
          checkExistsCord(prevState.row, prevState.col, successfulCords)
            ? 0
            : SQUARE_SIZE + 2 * SQUARE_PADDING,
          checkExistsCord(prevState.row, prevState.col, successfulCords)
            ? 0
            : SQUARE_SIZE + 2 * SQUARE_PADDING,
        )
        ctx.fillStyle = greyColor
        ctx
          .roundRect(
            DEFAULT_PADDING +
              prevState.row * SQUARE_SIZE +
              prevState.row * SQUARE_PADDING,
            DEFAULT_PADDING +
              prevState.col * SQUARE_SIZE +
              prevState.col * SQUARE_PADDING,
            SQUARE_SIZE,
            SQUARE_SIZE,
            BORDER_RADIUS,
          )
          .fill()
        ctx.fillStyle = whiteColor
        ctx.fillText(
          matrix[prevState.col][prevState.row],
          DEFAULT_PADDING +
            20 +
            prevState.row * SQUARE_SIZE +
            prevState.row * SQUARE_PADDING,
          DEFAULT_PADDING +
            30 +
            prevState.col * SQUARE_SIZE +
            prevState.col * SQUARE_PADDING,
        )
      }
      const el = arrResultCords.findIndex(
        obj => obj.row === prevState.row && obj.col === prevState.col,
      )
      // console.log({ el })
      arrResult.splice(el, 1)
      arrResultCords.splice(el, 1)
      prevState = state
      return
    } else if (!checkExistsCord(row, col, successfulCords)) {
      ctx.fillStyle = greenColor
      const direction = mouseMoveAlign(prevState, state)
      ctx.fillRect(
        isHorizontalValue.includes(direction)
          ? DEFAULT_PADDING +
              row * SQUARE_SIZE +
              (row + (direction === 'right' ? -1 : 0)) * SQUARE_PADDING
          : DEFAULT_PADDING + row * SQUARE_SIZE + row * SQUARE_PADDING,
        isVerticalValue.includes(direction)
          ? DEFAULT_PADDING +
              col * SQUARE_SIZE +
              (col + (direction === 'down' ? -1 : 0)) * SQUARE_PADDING
          : DEFAULT_PADDING + col * SQUARE_SIZE + col * SQUARE_PADDING,
        isHorizontalValue.includes(direction)
          ? SQUARE_SIZE + SQUARE_PADDING
          : SQUARE_SIZE,
        isVerticalValue.includes(direction)
          ? SQUARE_SIZE + SQUARE_PADDING
          : SQUARE_SIZE,
      )
    }

    ctx.fillStyle = whiteColor
    ctx.fillText(
      matrix[col][row],
      DEFAULT_PADDING + 20 + row * SQUARE_SIZE + row * SQUARE_PADDING,
      DEFAULT_PADDING + 30 + col * SQUARE_SIZE + col * SQUARE_PADDING,
    )
    prevState = state
    arrResult.push(matrix[col][row])
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
          DEFAULT_PADDING +
            item.row * SQUARE_SIZE +
            (item.row - 1) * SQUARE_PADDING,
          DEFAULT_PADDING +
            item.col * SQUARE_SIZE +
            (item.col - 1) * SQUARE_PADDING,
          checkExistsCord(item.row, item.col, successfulCords)
            ? 0
            : SQUARE_SIZE + 2 * SQUARE_PADDING,
          checkExistsCord(item.row, item.col, successfulCords)
            ? 0
            : SQUARE_SIZE + 2 * SQUARE_PADDING,
        )
        ctx.fillStyle = greyColor
        ctx
          .roundRect(
            DEFAULT_PADDING +
              item.row * SQUARE_SIZE +
              item.row * SQUARE_PADDING,
            DEFAULT_PADDING +
              item.col * SQUARE_SIZE +
              item.col * SQUARE_PADDING,
            SQUARE_SIZE,
            SQUARE_SIZE,
            BORDER_RADIUS,
          )
          .fill()
        if (checkExistsCord(item.row, item.col, successfulCords)) {
          ctx.fillStyle = greenColor
          ctx
            .roundRect(
              DEFAULT_PADDING +
                item.row * SQUARE_SIZE +
                item.row * SQUARE_PADDING,
              DEFAULT_PADDING +
                item.col * SQUARE_SIZE +
                item.col * SQUARE_PADDING,
              SQUARE_SIZE,
              SQUARE_SIZE,
              BORDER_RADIUS,
            )
            .fill()
        }
        ctx.fillStyle = '#FFF'
        ctx.fillText(
          matrix[item.col][item.row],
          DEFAULT_PADDING +
            20 +
            item.row * SQUARE_SIZE +
            item.row * SQUARE_PADDING,
          DEFAULT_PADDING +
            30 +
            item.col * SQUARE_SIZE +
            item.col * SQUARE_PADDING,
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
    if (canvasRef.current) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ctx = canvas.getContext('2d') as ICanvasRenderingContext2D
      ctx.fillStyle = '#000'
      ctx?.fillRect(0, 0, width, height)
      ctx.font = '24px serif'
      ctx.textAlign = 'center'

      for (let row = 0; row < matrix.length; row += 1)
        for (let col = 0; col < matrix[row].length; col += 1) {
          ctx.fillStyle = '#2B2B2B'
          ctx.strokeStyle = ctx.fillStyle
          ctx
            .roundRect(
              DEFAULT_PADDING + row * SQUARE_SIZE + row * SQUARE_PADDING,
              DEFAULT_PADDING + col * SQUARE_SIZE + col * SQUARE_PADDING,
              SQUARE_SIZE,
              SQUARE_SIZE,
              SQUARE_PADDING,
            )
            .fill()
          ctx.fillStyle = '#FFF'
          ctx.fillText(
            matrix[col][row],
            DEFAULT_PADDING + 20 + row * SQUARE_SIZE + row * SQUARE_PADDING,
            DEFAULT_PADDING + 30 + col * SQUARE_SIZE + col * SQUARE_PADDING,
          )
        }
      canvas?.addEventListener('mousedown', mouseDownHandler)
      return () => canvas?.removeEventListener('mousedown', mouseDownHandler)
    }
  }, [])

  return (
    <div className='word-find-game'>
      <h3>
        Found: {successfulWordsCount}/{words.length}
      </h3>
      <canvas ref={canvasRef} height={height} width={width} />
    </div>
  )
}

export default WordsFindGame
