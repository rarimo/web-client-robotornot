import './styles.scss'

import React, {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { createField } from './helpers'

enum Mask {
  Mine = -1,
  Open,
  Closed,
  Flag,
  RedMine,
}

type Props = {
  size: number
} & HTMLAttributes<HTMLDivElement>

const COUNTER_LENGTH = 3

export default function SapperGame({ size, className }: Props) {
  const dimension = new Array(size).fill(null)

  const [death, setDeath] = useState(false)
  const [remainingMines, setRemainingMines] = useState(size)
  const [time, setTime] = useState(0)

  const [field, setField] = useState<number[]>(() => createField(size))
  const [mask, setMask] = useState<Mask[]>(() =>
    new Array(size * size).fill(Mask.Closed),
  )
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const win = useMemo(
    () =>
      !field.some(
        (f, i) =>
          f === Mask.Mine && mask[i] !== Mask.Flag && mask[i] !== Mask.Open,
      ),
    [field, mask],
  )

  const startTimer = useCallback(() => {
    setTimer(setInterval(() => setTime(prevState => prevState + 1), 1000))
  }, [])

  const stopTimer = useCallback(() => {
    clearInterval(timer ? timer : '')
    setTimer(null)
  }, [timer])

  const clickSquare = useCallback(
    (x: number, y: number) => {
      if (win || death || mask[y * size + x] === Mask.Flag) return
      if (!timer) startTimer()
      if (mask[y * size + x] === Mask.Open) return

      const clearing: [number, number][] = []

      function clear(x: number, y: number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
          if (mask[y * size + x] === Mask.Open) return

          clearing.push([x, y])
        }
      }

      clear(x, y)

      while (clearing.length) {
        const item = clearing.pop()
        if (item) {
          const [x, y] = item

          mask[y * size + x] = Mask.Open

          if (field[y * size + x] !== 0) continue

          clear(x + 1, y)
          clear(x - 1, y)
          clear(x, y + 1)
          clear(x, y - 1)
        }
      }

      if (field[y * size + x] === Mask.Mine) {
        field.forEach((cell, i) => {
          if (cell === Mask.Mine) {
            mask[i] = Mask.Mine
          }
        })
        mask[y * size + x] = Mask.RedMine
        setDeath(true)
        stopTimer()
      }
      setMask(prev => [...prev])
    },
    [death, field, mask, size, startTimer, stopTimer, timer, win],
  )

  const rightClickSquare = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, x: number, y: number) => {
      e.preventDefault()
      e.stopPropagation()

      if (win || death) return

      if (mask[y * size + x] === Mask.Open) return

      if (mask[y * size + x] === Mask.Closed) {
        mask[y * size + x] = Mask.Flag
        setRemainingMines(prevState => prevState - 1)
      } else if (mask[y * size + x] === Mask.Flag) {
        setRemainingMines(prevState => prevState + 1)
        mask[y * size + x] = Mask.Closed
      }

      setMask(prev => [...prev])
    },
    [death, mask, size, win],
  )

  const getClassSquare = useCallback(
    (x: number, y: number) => {
      if (mask[y * size + x] === Mask.Open) {
        return `sapper-game__cell-type${field[y * size + x]}`
      }
      if (mask[y * size + x] === Mask.Closed) {
        return `sapper-game__cell-closed`
      }
      if (mask[y * size + x] === Mask.Flag) {
        return `sapper-game__cell-flag`
      }
      if (mask[y * size + x] === Mask.Mine) {
        return `sapper-game__cell-mine`
      }
      if (mask[y * size + x] === Mask.RedMine) {
        return `sapper-game__cell-mine-red`
      }
    },
    [field, mask, size],
  )

  const refresh = useCallback(() => {
    setField(() => createField(size))
    setMask(() => new Array(size * size).fill(Mask.Closed))
    setDeath(false)
    setRemainingMines(size)
    stopTimer()
    setTime(0)
  }, [size, stopTimer])

  const _formatNumbers = (num: number) => {
    return String(num).padStart(COUNTER_LENGTH, '0')
  }

  useEffect(() => {
    if (win) {
      stopTimer()
      //TODO: add win scenario
    }
  }, [stopTimer, win])

  return (
    <div className={['sapper-game', className].join(' ')}>
      <div className='sapper-game-container'>
        <div className='sapper-game__top-bar'>
          <div className='sapper-game__top-bar-counter bombs-number'>
            {_formatNumbers(remainingMines)}
          </div>
          <button
            className={[
              'sapper-game__top-bar-smile',
              death
                ? 'sapper-game__top-bar-smile-lose'
                : win
                ? 'sapper-game__top-bar-smile-win'
                : 'sapper-game__top-bar-smile-default',
            ].join(' ')}
            onClick={refresh}
          />
          <div className='sapper-game__top-bar-counter timer'>
            {_formatNumbers(time)}
          </div>
        </div>
        <div className='sapper-game__game-field'>
          {dimension.map((_, y) => {
            return (
              <div key={y} className={['sapper-game__row'].join(' ')}>
                {dimension.map((_, x) => {
                  return (
                    <button
                      className={[
                        'sapper-game__row-cell',
                        getClassSquare(x, y),
                      ].join(' ')}
                      key={x}
                      onClick={() => clickSquare(x, y)}
                      onContextMenu={e => rightClickSquare(e, x, y)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
