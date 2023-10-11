import './styles.scss'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import { AppButton } from '@/common'
import { ICON_NAMES } from '@/enums'

import { checkExistsCord, createWordMatrix, mouseMoveAlign } from './helpers'

type Props = {
  words: string[]
  rows: number
  cols: number
  isShown: boolean
  setIsShown: (isShown: boolean) => void
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

const SQUARE_SIZE = 44
const SQUARE_PADDING = 8
const DEFAULT_PADDING = 32
const DEFAULT_PADDING_VERTICAL = 32
const BORDER_RADIUS = 8
const greenColor = 'rgba(44,167,75,0.5)'
const greyColor = '#2b2b2b'
const blackColor = '#000'
const whiteColor = '#fff'
const purpleColor = 'rgba(122, 83, 171, 0.6)'
const LETTER_PADDING_X = 20
const LETTER_PADDING_Y = 30
const FONT_SIZE = 24
const SECTION_TOP_PADDING = 128

const isHorizontalValue = ['left', 'right']
const isVerticalValue = ['up', 'down']

const WordsScrambleGame = ({
  words,
  rows,
  cols,
  isShown,
  setIsShown,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  const [successfulWordsCount, setSuccessfulWordsCount] = useState(0)

  let ctx: ICanvasRenderingContext2D

  let arrResult: string[] = []
  let arrResultCords: Cell[] = []
  let successfulCords: Cell[] = []
  let prevState = { col: -1, row: -1 }
  let state: Cell

  let sideBarBlock: HTMLDivElement | null
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
  }, [blockHeight, canvasHeight, canvasWidth, resizeGameRatio, resizeGameRatioType])

  const matrix = useMemo(() => {
    return createWordMatrix(words, rows, cols)
  }, [words, cols, rows])

  const printLetter = (col: number, row: number) => {
    ctx.fillStyle = whiteColor
    ctx.fillText(
      matrix[row][col],
      defaultPadding + letterPaddingX + col * squareSize + col * squarePadding,
      defaultPaddingVertical +
        letterPaddingY +
        row * squareSize +
        row * squarePadding,
    )
  }

  const fillActiveSquare = (event: MouseEvent) => {
    const col = Math.trunc(
      (event.offsetX - defaultPadding / 2) / ((squareSize + squarePadding) / 2),
    )
    const row = Math.trunc(
      (event.offsetY - defaultPaddingVertical / 2) /
        ((squareSize + squarePadding) / 2),
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
            defaultPaddingVertical +
              prevState.row * squareSize +
              prevState.row * squarePadding,
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
        defaultPadding + col * squareSize + (col - 1) * squarePadding,
        defaultPadding + row * squareSize + (row - 1) * squarePadding,
        checkExistsCord(row, col, successfulCords)
          ? 0
          : squareSize + 2 * squarePadding,
        checkExistsCord(row, col, successfulCords)
          ? 0
          : squareSize + 2 * squarePadding,
      )
      ctx.fillStyle = greyColor
      ctx
        .roundRect(
          defaultPadding + col * squareSize + col * squarePadding,
          defaultPaddingVertical + row * squareSize + row * squarePadding,
          squareSize,
          squareSize,
          BORDER_RADIUS,
        )
        .fill()
      ctx.fillStyle = greenColor
      const direction = mouseMoveAlign(prevState, state)
      ctx.fillRect(
        isVerticalValue.includes(direction)
          ? defaultPadding +
              col * squareSize +
              (col + (direction === 'down' ? -1 : 0)) * squarePadding
          : defaultPadding + col * squareSize + col * squarePadding,
        isHorizontalValue.includes(direction)
          ? defaultPaddingVertical +
              row * squareSize +
              (row + (direction === 'right' ? -1 : 0)) * squarePadding
          : defaultPaddingVertical + row * squareSize + row * squarePadding,
        isVerticalValue.includes(direction)
          ? squareSize + squarePadding
          : squareSize,
        isHorizontalValue.includes(direction)
          ? squareSize + squarePadding
          : squareSize,
      )
    }
    printLetter(col, row)
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
        if (checkExistsCord(item.row, item.col, successfulCords)) {
          ctx.fillStyle = purpleColor
          ctx.fillRect(
            defaultPadding + item.col * squareSize + item.col * squarePadding,
            defaultPadding + item.row * squareSize + item.row * squarePadding,
            squareSize,
            squareSize,
          )
        } else {
          ctx.fillStyle = blackColor
          ctx.fillRect(
            defaultPadding +
              item.col * squareSize +
              (item.col - 1) * squarePadding,
            defaultPaddingVertical +
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
              defaultPaddingVertical +
                item.row * squareSize +
                item.row * squarePadding,
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
        ctx.fillStyle = purpleColor
        const direction = mouseMoveAlign(localPrevState, { col, row })
        ctx.fillRect(
          isVerticalValue.includes(direction)
            ? defaultPadding +
                col * squareSize +
                (col + (direction === 'down' ? -1 : 0)) * squarePadding
            : defaultPadding + col * squareSize + col * squarePadding,
          isHorizontalValue.includes(direction)
            ? defaultPaddingVertical +
                row * squareSize +
                (row + (direction === 'right' ? -1 : 0)) * squarePadding
            : defaultPaddingVertical + row * squareSize + row * squarePadding,
          isVerticalValue.includes(direction)
            ? squareSize + squarePadding
            : squareSize,
          isHorizontalValue.includes(direction)
            ? squareSize + squarePadding
            : squareSize,
        )
        printLetter(col, row)
        localPrevState = { col, row }
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
    ctx.font = `${FONT_SIZE * resizeGameRatio}px Euclid Circular B`
    ctx.textAlign = 'center'
    for (let col = 0; col < matrix.length; col += 1)
      for (let row = 0; row < matrix[col].length; row += 1) {
        ctx.fillStyle = '#2B2B2B'
        ctx.strokeStyle = ctx.fillStyle
        ctx
          .roundRect(
            defaultPadding + row * squareSize + row * squarePadding,
            defaultPaddingVertical + col * squareSize + col * squarePadding,
            squareSize,
            squareSize,
            squarePadding,
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
      className='word-find-game'
      transition={{ ease: 'easeOut', duration: 0.5 }}
      initial={{ y: '101%' }}
      animate={{ y: isShown ? 0 : '101%' }}
    >
      <div className='word-find-game__header'>
        <p className='word-find-game__header-count'>{`Found: ${successfulWordsCount}/${words.length}`}</p>
        <AppButton
          className='word-find-game__header-btn'
          scheme='none'
          size='none'
          iconRight={ICON_NAMES.x}
          onClick={() => setIsShown(false)}
        />
      </div>
      <p className='word-find-game__text'>
        {'Interactive game during the wait time'}
      </p>
      <canvas ref={canvasRef} height={height} width={width} />
    </motion.div>
  )
}

export default WordsScrambleGame
