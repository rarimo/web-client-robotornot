import './styles.scss'

import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useClickAway } from 'react-use'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  isShown: boolean
  updateIsShown: (isShown: boolean) => void

  isCloseByClickOutside?: boolean
} & HTMLAttributes<HTMLDivElement> &
  MotionProps

const Drawer: FC<Props> = ({
  isShown,
  updateIsShown,
  className,

  isCloseByClickOutside = true,

  children,
  ...rest
}) => {
  const location = useLocation()

  const uid = useMemo(() => uuidv4(), [])

  const drawerRef = useRef(null)

  useClickAway(drawerRef, () => {
    if (isCloseByClickOutside) {
      updateIsShown(false)
    }
  })

  useEffect(() => {
    updateIsShown(false)
  }, [location, updateIsShown])

  return (
    <AnimatePresence>
      {isShown && (
        <>
          <motion.div
            className='drawer__backdrop'
            onClick={() => updateIsShown(false)}
            variants={{
              closed: {
                width: '0',
              },
              open: {
                width: '100%',
              },
            }}
            initial='closed'
            animate='open'
            exit='closed'
          />
          <motion.div
            key={`drawer-${uid}`}
            className={`drawer ${className || ''}`}
            variants={{
              closed: {
                width: '0',
                opacity: 0,
              },
              open: {
                width: 'auto',
                opacity: 1,
              },
            }}
            initial='closed'
            animate='open'
            exit='closed'
            ref={drawerRef}
            {...rest}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Drawer
