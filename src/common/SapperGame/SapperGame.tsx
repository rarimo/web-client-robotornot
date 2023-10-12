import './styles.scss'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import { calculateMineCounts, generateMines } from './helpers'

type Props = {
  mines: number
  rows: number
  cols: number
}

type Cell = {
  row: number
  col: number
  color?: number
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

const SQUARE_SIZE = 40
const SQUARE_PADDING = 2
const DEFAULT_PADDING = 16
const DEFAULT_PADDING_VERTICAL = 16
const BORDER_RADIUS = 4
const greyColor = '#949494'
const blackColor = '#000'
const whiteColor = '#fff'
const LETTER_PADDING_X = 20
const LETTER_PADDING_Y = 30
const FONT_SIZE = 24

const WordsScrambleGame = ({ mines, rows, cols }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  let canvas: HTMLCanvasElement
  const [blockWidth, setBlockWidth] = useState(0)
  const [blockHeight, setBlockHeight] = useState(0)

  const canvasWidth =
    2 * DEFAULT_PADDING + SQUARE_PADDING * (cols - 1) + SQUARE_SIZE * cols

  const canvasHeight =
    2 * DEFAULT_PADDING_VERTICAL +
    SQUARE_PADDING * (rows - 1) +
    SQUARE_SIZE * rows

  const resizeGameRatio = useMemo(() => {
    const ratioWidth = blockWidth / canvasWidth
    const ratioHeight = blockHeight / canvasHeight
    return ratioWidth >= ratioHeight
      ? ratioHeight >= 1
        ? 2
        : 2 * ratioHeight
      : ratioWidth >= 1
      ? 2
      : 2 * ratioWidth
  }, [blockHeight, blockWidth, canvasHeight, canvasWidth])

  const resizeGameRatioType = useMemo(() => {
    const ratioWidth = blockWidth / canvasWidth
    const ratioHeight = blockHeight / canvasHeight
    return ratioWidth >= ratioHeight ? 'height' : 'width'
  }, [blockHeight, blockWidth, canvasHeight, canvasWidth])

  const squareSize = useMemo(() => {
    return SQUARE_SIZE * resizeGameRatio
  }, [resizeGameRatio])

  const squarePadding = useMemo(() => {
    return SQUARE_PADDING * resizeGameRatio
  }, [resizeGameRatio])

  const defaultPadding = useMemo(() => {
    return (DEFAULT_PADDING * resizeGameRatio) / 2
  }, [resizeGameRatio])

  const defaultPaddingVertical = useMemo(() => {
    return (DEFAULT_PADDING_VERTICAL * resizeGameRatio) / 2
  }, [resizeGameRatio])

  const letterPaddingX = useMemo(() => {
    return LETTER_PADDING_X * resizeGameRatio
  }, [resizeGameRatio])

  const letterPaddingY = useMemo(() => {
    return LETTER_PADDING_Y * resizeGameRatio
  }, [resizeGameRatio])

  const width = useMemo(() => {
    return blockWidth > canvasWidth
      ? 2 * canvasWidth
      : resizeGameRatioType === 'height'
      ? blockWidth * resizeGameRatio
      : 2 * blockWidth
  }, [blockWidth, canvasWidth, resizeGameRatio, resizeGameRatioType])

  const height = useMemo(() => {
    return blockHeight > canvasHeight
      ? 2 * canvasWidth
      : resizeGameRatioType === 'width'
      ? blockHeight * resizeGameRatio
      : 2 * blockHeight
  }, [
    blockHeight,
    canvasHeight,
    canvasWidth,
    resizeGameRatio,
    resizeGameRatioType,
  ])

  const minesInField = useMemo(() => {
    return generateMines(rows, cols, mines)
  }, [cols, mines, rows])

  const gameField = useMemo(() => {
    return calculateMineCounts(minesInField, rows, cols)
  }, [cols, minesInField, rows])

  const init = () => {
    canvas = canvasRef.current
    const ctx = canvas.getContext('2d') as ICanvasRenderingContext2D

    if (!canvas || !ctx || !gameField) return

    const sideBarBlock = document.querySelector('.sapper-game')
    setBlockWidth(sideBarBlock ? sideBarBlock.getBoundingClientRect().width : 0)
    setBlockHeight(
      sideBarBlock ? sideBarBlock.getBoundingClientRect().height : 0,
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

    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width / 2}px`
    canvas.style.height = `${height / 2}px`

    ctx.clearRect(defaultPadding, defaultPaddingVertical, width, height)

    ctx.fillStyle = 'blue'
    ctx.font = '20px Arial'

    ctx.fillStyle = 'black'

    ctx.fillRect(
      0,
      0,
      (squareSize + squarePadding) * cols,
      (squareSize + squarePadding) * rows,
    )

    ctx.fillStyle = 'gray'

    gameField.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        ctx
          .roundRect(
            colIndex * (squareSize + squarePadding),
            rowIndex * (squareSize + squarePadding),
            squareSize,
            squareSize,
            BORDER_RADIUS,
          )
          .fill()
      })
    })
  }
  const clickSquare = (event: MouseEvent) => {
    const col = Math.trunc(
      (event.offsetX - defaultPadding / 2) / ((squareSize + squarePadding) / 2),
    )
    const row = Math.trunc(
      (event.offsetY - defaultPaddingVertical / 2) /
        ((squareSize + squarePadding) / 2),
    )

    console.log({ col, row })
  }

  const addClickHandler = canvas => {
    if (!canvas) return
    canvas.addEventListener('mouseup', clickSquare)
    return () => canvas.removeEventListener('mouseup', clickSquare)
  }

  useEffect(() => {
    init()
    addClickHandler(canvas)
  }, [gameField, height, width, resizeGameRatio])

  return (
    <motion.div
      className='sapper-game'
      // transition={{ ease: 'backInOut', duration: 0.5 }}
      // initial={{ y: 0 }}
      // animate={{ y: isShown ? 0 : 0 }}
    >
      <canvas ref={canvasRef} height={height} width={width} />
    </motion.div>
  )
}

export default WordsScrambleGame
