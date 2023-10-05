import './styles.scss'

import { AnimatePresence, LayoutGroup, motion, Variants } from 'framer-motion'
import { type FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ErrorMessage, Icon, Loader } from '@/common'
import { useFormStepperContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement>

const mainContentAnimationVariants: Variants = {
  open: {
    width: '100%',
    overflowX: 'hidden',
  },
  collapsed: {
    width: '66.6%',
    overflowX: 'hidden',
  },
}

const sidebarAnimationVariants: Variants = {
  open: {
    width: '33.3%',
    overflowX: 'hidden',
    marginLeft: '24px',
  },
  collapsed: {
    width: 0,
    overflowX: 'hidden',
    marginLeft: '0',
  },
}

const togglerAnimationVariants: Variants = {
  shown: { overflow: 'hidden', scale: 1 },
  hidden: { overflow: 'hidden', scale: 0 },
}

const MainPage: FC<Props> = ({ className, ...rest }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const sidebarUuid = useMemo(() => uuidv4(), [])
  const mainContentUuid = useMemo(() => uuidv4(), [])

  const {
    isLoaded,
    isLoadFailed,

    stepsProgress,

    StepComponent,
    SidebarComponent,
  } = useFormStepperContext()

  const SidebarToggler = useCallback(
    (type: 'expand' | 'collapse') => (
      <motion.button
        className='main-page__content-sidebar-toggler-wrp'
        onClick={() => setIsSidebarOpen(prev => !prev)}
        initial='hidden'
        animate='shown'
        exit='hidden'
        variants={togglerAnimationVariants}
        transition={{ duration: '0.5' }}
      >
        <Icon
          className='main-page__content-sidebar-toggler-icon'
          name={type === 'expand' ? ICON_NAMES.sidebar : ICON_NAMES.collapse}
        />
      </motion.button>
    ),
    [],
  )

  // TODO: add steps indicator
  return (
    <div className={['main-page', className].join(' ')} {...rest}>
      {isLoaded ? (
        isLoadFailed ? (
          <ErrorMessage message={`Ooops... something went wrong`} />
        ) : (
          <LayoutGroup>
            <h3>{stepsProgress}</h3>

            <motion.div
              className='main-page__content'
              key={mainContentUuid}
              variants={mainContentAnimationVariants}
              initial='open'
              animate='collapsed'
              exit='open'
              transition={{
                duration: '0.75',
                ease: 'backInOut',
              }}
            >
              <AnimatePresence mode='wait' initial={false}>
                {StepComponent}
              </AnimatePresence>

              <AnimatePresence>
                {!isSidebarOpen && SidebarToggler('expand')}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  className='main-page__sidebar'
                  key={sidebarUuid}
                  variants={sidebarAnimationVariants}
                  initial='collapsed'
                  animate='open'
                  exit='collapsed'
                  transition={{
                    duration: '0.75',
                    delay: 0.5,
                    ease: 'backInOut',
                  }}
                >
                  <div className='main-page__sidebar-content'>
                    <AnimatePresence mode='wait' initial={false}>
                      {SidebarComponent}
                    </AnimatePresence>

                    <AnimatePresence>
                      {SidebarToggler('collapse')}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        )
      ) : (
        <div className='main-page__loader-wrp main-page__content'>
          <Loader className='main-page__loader' />
        </div>
      )}
    </div>
  )
}

export default MainPage
