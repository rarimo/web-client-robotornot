import { motion, MotionProps } from 'framer-motion'
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Directions } from '@/common/WordsScrambleGame/enums'

import { checkExistsCord, createWordMatrix, mouseMoveAlign } from './helpers'
import { useStateRef } from './hooks'

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
  align?: Directions
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
const successColors: string[] = [
  'rgba(122, 83, 171, 0.6)',
  'rgba(48,68,254,0.6)',
  'rgba(255,121,85,0.6)',
  'rgba(44,167,75,0.5)',
  'rgba(250,217,2,0.65)',
  'rgba(91, 241, 205, 0.6)',
]
const isHorizontalValue = [Directions.Left, Directions.Right]
const isVerticalValue = [Directions.Up, Directions.Down]

const WordsScrambleGame = ({
  words,
  rows,
  cols,
  className,
  onStatusGameUpdated,
  ...rest
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  const wordsScrambleGameRef = useRef<HTMLDivElement | null>(null)

  const [, setSuccessfulWordsCount, successfulWordsCountRef] =
    useStateRef<number>(0)
  const [blockWidth, setBlockWidth] = useState(0)
  const [blockHeight, setBlockHeight] = useState(0)
  const [ctx, setCtx] = useState({} as ICanvasRenderingContext2D)

  const [, setDirectionGame, directionGame] = useStateRef<string>('')
  const [, setArrResult, arrResultRef] = useStateRef<string[]>([])
  const [, setArrResultCords, arrResultCordsRef] = useStateRef<Cell[]>([])
  const [, setSuccessfulCords, successfulCordsRef] = useStateRef<Cell[]>([])
  const [, setCordsPrevState, cordsPrevStateRef] = useStateRef<Cell>({
    col: -1,
    row: -1,
  })
  const [remainingWords, setRemainingWords] = useState<string[]>([...words])
  const [
    ,
    setSuccessfulWordsColorNumberIndex,
    successfulWordsColorNumberIndexRef,
  ] = useStateRef<number>(0)

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

  const _printLetter = useCallback(
    (col: number, row: number) => {
      ctx.fillStyle = whiteColor
      ctx.fillText(
        matrix[row][col],
        defaultPadding + letterPaddingX + col * squareSize + col * gap,
        defaultPaddingVertical + letterPaddingY + row * squareSize + row * gap,
      )
    },
    [
      ctx,
      defaultPadding,
      defaultPaddingVertical,
      gap,
      letterPaddingX,
      letterPaddingY,
      matrix,
      squareSize,
    ],
  )

  const fillActiveSquare = useCallback(
    (event: MouseEvent) => {
      const col = Math.trunc(
        (event.offsetX - defaultPadding / 2) / ((squareSize + gap) / 2),
      )
      const row = Math.trunc(
        (event.offsetY - defaultPaddingVertical / 2) / ((squareSize + gap) / 2),
      )
      let align = Directions.Default

      if (col === cols || row === rows) return
      const cordsState = { col, row }
      align = mouseMoveAlign(cordsPrevStateRef.current, cordsState)
      if (align === Directions.Diagonal) return
      const direction = isVerticalValue.includes(align)
        ? Directions.Vertical
        : Directions.Horizontal
      if (
        cordsState.row === cordsPrevStateRef.current.row &&
        cordsState.col === cordsPrevStateRef.current.col
      )
        return

      if (!directionGame.current && align !== Directions.Default) {
        setDirectionGame(direction)
      }

      if (align !== Directions.Default && directionGame.current !== direction)
        return

      if (
        checkExistsCord(row, col, arrResultCordsRef.current) &&
        arrResultCordsRef.current.length > 1
      ) {
        if (
          !checkExistsCord(
            cordsPrevStateRef.current.row,
            cordsPrevStateRef.current.col,
            successfulCordsRef.current,
          )
        ) {
          ctx.fillStyle = blackColor
          ctx.fillRect(
            defaultPadding +
              cordsPrevStateRef.current.col * squareSize +
              (cordsPrevStateRef.current.col - 1) * gap,
            defaultPadding +
              cordsPrevStateRef.current.row * squareSize +
              (cordsPrevStateRef.current.row - 1) * gap,
            checkExistsCord(
              cordsPrevStateRef.current.row,
              cordsPrevStateRef.current.col,
              successfulCordsRef.current,
            )
              ? 0
              : squareSize + 2 * gap,
            checkExistsCord(
              cordsPrevStateRef.current.row,
              cordsPrevStateRef.current.col,
              successfulCordsRef.current,
            )
              ? 0
              : squareSize + 2 * gap,
          )
          ctx.fillStyle = greyColor
          ctx
            .roundRect(
              defaultPadding +
                cordsPrevStateRef.current.col * squareSize +
                cordsPrevStateRef.current.col * gap,
              defaultPaddingVertical +
                cordsPrevStateRef.current.row * squareSize +
                cordsPrevStateRef.current.row * gap,
              squareSize,
              squareSize,
              BORDER_RADIUS,
            )
            .fill()
          _printLetter(
            cordsPrevStateRef.current.col,
            cordsPrevStateRef.current.row,
          )
        }

        const elIndex = arrResultCordsRef.current.findIndex(
          obj =>
            obj.row === cordsPrevStateRef.current.row &&
            obj.col === cordsPrevStateRef.current.col,
        )
        setArrResult(prevState => {
          prevState.splice(elIndex, 1)
          return prevState
        })
        setArrResultCords(prevState => {
          prevState.splice(elIndex, 1)
          return prevState
        })
        setCordsPrevState(cordsState)
        return
      } else {
        ctx.fillStyle = blackColor
        ctx.fillRect(
          defaultPadding + col * squareSize + (col - 1) * gap,
          defaultPadding + row * squareSize + (row - 1) * gap,
          checkExistsCord(row, col, successfulCordsRef.current)
            ? 0
            : squareSize + 2 * gap,
          checkExistsCord(row, col, successfulCordsRef.current)
            ? 0
            : squareSize + 2 * gap,
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
        ctx.fillRect(
          isVerticalValue.includes(align)
            ? defaultPadding +
                col * squareSize +
                (col + (align === Directions.Down ? -1 : 0)) * gap
            : defaultPadding + col * squareSize + col * gap,
          isHorizontalValue.includes(align)
            ? defaultPaddingVertical +
                row * squareSize +
                (row + (align === Directions.Right ? -1 : 0)) * gap
            : defaultPaddingVertical + row * squareSize + row * gap,
          isVerticalValue.includes(align) ? squareSize + gap : squareSize,
          isHorizontalValue.includes(align) ? squareSize + gap : squareSize,
        )
      }
      _printLetter(col, row)
      setCordsPrevState(cordsState)
      setArrResult(prevState => [...prevState, matrix[row][col]])
      setArrResultCords(prevState => [
        ...prevState,
        {
          col,
          row,
          color: successfulWordsColorNumberIndexRef.current,
          align: align,
        },
      ])
    },
    [
      defaultPadding,
      squareSize,
      gap,
      defaultPaddingVertical,
      cols,
      rows,
      cordsPrevStateRef,
      directionGame,
      arrResultCordsRef,
      _printLetter,
      setCordsPrevState,
      setArrResult,
      setArrResultCords,
      setDirectionGame,
      successfulCordsRef,
      ctx,
      matrix,
      successfulWordsColorNumberIndexRef,
    ],
  )

  const checkResult = useCallback(() => {
    const resultWord = arrResultRef.current.join('').toLowerCase()
    const resultWordIndex = remainingWords.findIndex(el => el === resultWord)
    if (resultWordIndex !== -1) {
      setRemainingWords(prevState => prevState.splice(resultWordIndex, 1))
      setSuccessfulCords(prevState =>
        prevState.concat(arrResultCordsRef.current),
      )
      setSuccessfulWordsCount(prevState => prevState + 1)
      onStatusGameUpdated({ found: successfulWordsCountRef.current + 1 })
      return true
    }
    return false
  }, [
    arrResultCordsRef,
    arrResultRef,
    onStatusGameUpdated,
    remainingWords,
    setSuccessfulCords,
    setSuccessfulWordsCount,
    successfulWordsCountRef,
  ])

  const clear = useCallback(() => {
    canvasRef.current?.removeEventListener('mousemove', fillActiveSquare)
    if (!checkResult()) {
      for (const item of arrResultCordsRef.current) {
        if (checkExistsCord(item.row, item.col, successfulCordsRef.current)) {
          const square = successfulCordsRef.current.find(
            obj => obj.row === item.row && obj.col === item.col,
          )
          const direction = square?.align ?? Directions.Default

          ctx.fillStyle = successColors[square?.color ?? 0]
          ctx.fillRect(
            isVerticalValue.includes(direction)
              ? defaultPadding +
                  item.col * squareSize +
                  (item.col + (direction === Directions.Down ? -1 : 0)) * gap
              : defaultPadding + item.col * squareSize + item.col * gap,
            isHorizontalValue.includes(direction)
              ? defaultPaddingVertical +
                  item.row * squareSize +
                  (item.row + (direction === Directions.Right ? -1 : 0)) * gap
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
            checkExistsCord(item.row, item.col, successfulCordsRef.current)
              ? 0
              : squareSize + 2 * gap,
            checkExistsCord(item.row, item.col, successfulCordsRef.current)
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
        _printLetter(item.col, item.row)
      }
    } else {
      let localPrevState = { col: -1, row: -1 }
      for (const { col, row } of arrResultCordsRef.current) {
        ctx.fillStyle =
          successColors[successfulWordsColorNumberIndexRef.current]
        const direction = mouseMoveAlign(localPrevState, { col, row })
        ctx.fillRect(
          isVerticalValue.includes(direction)
            ? defaultPadding +
                col * squareSize +
                (col + (direction === Directions.Down ? -1 : 0)) * gap
            : defaultPadding + col * squareSize + col * gap,
          isHorizontalValue.includes(direction)
            ? defaultPaddingVertical +
                row * squareSize +
                (row + (direction === Directions.Right ? -1 : 0)) * gap
            : defaultPaddingVertical + row * squareSize + row * gap,
          isVerticalValue.includes(direction) ? squareSize + gap : squareSize,
          isHorizontalValue.includes(direction) ? squareSize + gap : squareSize,
        )
        _printLetter(col, row)
        localPrevState = { col, row }
      }
      setSuccessfulWordsColorNumberIndex(prevState =>
        prevState + 1 >= successColors.length ? 0 : prevState + 1,
      )
    }
    setDirectionGame('')
    setArrResult([])
    setArrResultCords([])
    setCordsPrevState({ col: -1, row: -1 })
  }, [
    fillActiveSquare,
    checkResult,
    setDirectionGame,
    setArrResult,
    setArrResultCords,
    setCordsPrevState,
    arrResultCordsRef,
    successfulCordsRef,
    _printLetter,
    ctx,
    defaultPadding,
    squareSize,
    gap,
    defaultPaddingVertical,
    setSuccessfulWordsColorNumberIndex,
    successfulWordsColorNumberIndexRef,
  ])

  const mouseDownHandler = useCallback(() => {
    canvasRef.current?.addEventListener('mousemove', fillActiveSquare)
    canvasRef.current?.addEventListener('mouseup', clear)
  }, [fillActiveSquare, clear])

  const getSizeBlock = useCallback(() => {
    const block = wordsScrambleGameRef.current
    setBlockWidth(block ? block.getBoundingClientRect().width : 0)
    setBlockHeight(block ? block.getBoundingClientRect().height : 0)
  }, [])

  const initCtx = useCallback(() => {
    getSizeBlock()
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
    setCtx(canvas.getContext('2d') as ICanvasRenderingContext2D)
  }, [getSizeBlock, height, width])

  const initGameField = useCallback(() => {
    if (!ctx.fillRect || !matrix.length || !matrix[0].length) return
    ctx.fillStyle = blackColor
    ctx.fillRect(0, 0, width, height)
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
        _printLetter(row, col)
      }
  }, [
    _printLetter,
    ctx,
    defaultPadding,
    defaultPaddingVertical,
    gap,
    height,
    matrix,
    resizeGameRatio,
    squareSize,
    width,
  ])

  useEffect(() => {
    if (canvasRef.current) {
      initCtx()
    }
  }, [width, height, resizeGameRatio, initCtx])

  useEffect(() => {
    initGameField()
  }, [initGameField])

  useEffect(() => {
    const canvas = canvasRef.current
    canvas?.addEventListener('mousedown', mouseDownHandler)
    window.addEventListener('resize', getSizeBlock)
    return () => {
      canvas?.removeEventListener('mousedown', mouseDownHandler)
      window.removeEventListener('resize', getSizeBlock)
    }
  }, [mouseDownHandler, getSizeBlock])

  return (
    <motion.div
      className={['words-scramble-game', className].join(' ')}
      {...rest}
      ref={wordsScrambleGameRef}
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
