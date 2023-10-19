import './styles.scss'

import {
  AnimatePresence,
  motion,
  type MotionProps,
  Variants,
} from 'framer-motion'
import { FC, HTMLAttributes, useState } from 'react'

import { AppButton, WordsScrambleGame } from '@/common'
import { ICON_NAMES } from '@/enums'

const words = [
  'bitcoin',
  'luna',
  'rarimo',
  'moon',
  'polygon',
  'mumbai',
  'ether',
]
const rows = 9
const cols = 7

const gameAnimationVariants: Variants = {
  hidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    y: 100,
  },
  visible: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 1,
    y: 0,
    zIndex: 1,
  },
}

type Props = MotionProps &
  HTMLAttributes<HTMLDivElement> & {
    isShown: boolean
    setIsShown: (isShown: boolean) => void
  }

const SidebarGame: FC<Props> = ({
  isShown,
  setIsShown,
  className,
  ...rest
}) => {
  const [gameStatus, setGameStatus] = useState({
    found: 0,
  })

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          {...rest}
          className={['sidebar-game', className].join(' ')}
          variants={gameAnimationVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          transition={{
            duration: 0.5,
            ease: 'backInOut',
          }}
        >
          <div className='sidebar-game__header'>
            <p className='sidebar-game__header-count'>{`Found: ${gameStatus.found}/${words.length}`}</p>
            <AppButton
              className='sidebar-game__header-btn'
              scheme='none'
              size='none'
              iconRight={ICON_NAMES.x}
              onClick={() => setIsShown(false)}
            />
          </div>
          <p className='sidebar-game__overtitle'>
            {'Interactive game during the wait time'}
          </p>
          <p className='sidebar-game__title'>{'Let’s find words!'}</p>

          <WordsScrambleGame
            className='sidebar-game__content'
            words={words}
            rows={rows}
            cols={cols}
            onStatusGameUpdated={setGameStatus}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SidebarGame
