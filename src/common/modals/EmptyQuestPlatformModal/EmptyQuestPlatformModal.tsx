import './styles.scss'

import { MotionProps } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import { BasicModal, WrappedIcon } from '@/common'
import { useKycContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

const EmptyQuestPlatformModal: FC<Props> = ({ ...rest }) => {
  const { questPlatformDetails } = useKycContext()

  return (
    <BasicModal
      className='empty-quest-platform-modal'
      isShown={!questPlatformDetails?.questCreatorDetails?.iconLink}
      updateIsShown={() => {
        /* empty */
      }}
      isCloseByClickOutside={false}
      title={`Were are you from?`}
      {...rest}
    >
      <div className='empty-quest-platform-modal__body'>
        <WrappedIcon
          className='empty-quest-platform-modal__icon'
          iconName={ICON_NAMES.exclamation}
        />

        <span className='empty-quest-platform-modal__subtitle'>
          {`Looks like you went here accidentally`}
        </span>
      </div>
    </BasicModal>
  )
}

export default EmptyQuestPlatformModal
