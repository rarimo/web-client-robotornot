import { motion } from 'framer-motion'
import { FC, useEffect } from 'react'

import { useFormStepperContext } from '@/contexts'
import { useSidebarAnimation } from '@/hooks'
import { SidebarProps } from '@/pages/MainPage/components/types'

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const { isSidebarAnimationCompleted } = useFormStepperContext()
  const { imageSeq, animateSequence } = useSidebarAnimation()

  useEffect(() => {
    if (!isSidebarAnimationCompleted || !imageSeq.current) return

    animateSequence('/images/sequences/sidebar-8/8_000', 36)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarAnimationCompleted])

  return (
    <motion.div
      className={[
        'sidebar-content',
        'app__step-sidebar-content',
        className,
      ].join(' ')}
      {...rest}
    >
      <div className='app__step-sidebar-content-img-wrp app__step-sidebar-content-img-wrp--single'>
        <img
          ref={imageSeq}
          className='app__step-sidebar-content-img'
          src='/images/sequences/sidebar-8/8_0000.png'
          alt='sidebar-content'
        />
      </div>
    </motion.div>
  )
}

export default SidebarContent
