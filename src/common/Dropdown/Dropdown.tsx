import './styles.scss'

import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, ReactNode, useMemo, useRef } from 'react'
import { useClickAway } from 'react-use'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  duration?: number
  head: ReactNode
} & HTMLAttributes<HTMLDivElement> &
  MotionProps

const Dropdown: FC<Props> = ({
  isOpen,
  setIsOpen,
  duration = 0.25,
  children,
  head,
  ...rest
}) => {
  const uid = useMemo(() => uuidv4(), [])

  const dropdownEl = useRef<HTMLDivElement>(null)

  useClickAway(dropdownEl, () => {
    setIsOpen(false)
  })

  return (
    <div className='dropdown__wrp' ref={dropdownEl}>
      <div className='dropdown__head'>{head}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='dropdown__body'
            key={`dropdown-${uid}`}
            initial='dropdowned'
            animate='open'
            exit='dropdowned'
            variants={{
              open: { opacity: 1, height: 'auto', overflowY: 'hidden' },
              dropdowned: { opacity: 0, height: 0, overflowY: 'hidden' },
            }}
            transition={{ duration: duration }}
            {...rest}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown
