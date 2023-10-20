import './styles.scss'

import {
  AnimatePresence,
  motion,
  type MotionProps,
  Variants,
} from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import { AppButton } from '@/common'
import SapperGame from '@/common/SapperGame'
import { useFormStepperContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'

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
  const { setIsSidebarClosingDisabled } = useFormStepperContext()

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
            <AppButton
              className='sidebar-game__header-btn'
              scheme='none'
              size='none'
              iconRight={ICON_NAMES.x}
              onClick={() => {
                setIsShown(false)
                setIsSidebarClosingDisabled(false)
              }}
            />
          </div>
          <p className='sidebar-game__overtitle'>
            {
              'Zero-knowledge proofs are still a bit slow to generate. Enjoy the game while we take care of it!'
            }
          </p>

          <SapperGame className='sidebar-game__content' size={8} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SidebarGame
