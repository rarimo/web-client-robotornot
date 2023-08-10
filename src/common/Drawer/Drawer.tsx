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
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: '0',
              right: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99,
            }}
            onClick={() => updateIsShown(false)}
          />
          <motion.div
            key={`drawer-${uid}`}
            style={{
              display: 'flex',
              position: 'fixed',
              height: '100%',
              zIndex: 100,
              top: '0',
              right: '0',
              overflow: 'hidden',
            }}
            variants={{
              closed: {
                width: '0',
                opacity: 0,
                transitionDuration: '0.15s',
              },
              open: {
                width: 'auto',
                opacity: 1,
                transitionDuration: '0.15s',
              },
            }}
            initial='closed'
            animate='open'
            exit='closed'
            className={`drawer ${className || ''}`}
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
