import './styles.scss'

import { config } from '@config'
import { MotionProps } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'

import { AppButton, BasicModal, WrappedIcon } from '@/common'
import { useMetamaskZkpSnapContext, useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    isShown: boolean
  }

const InvalidChainModal: FC<Props> = ({ isShown, ...rest }) => {
  const { provider, isValidChain, requestSwitchChain } = useWeb3Context()
  const { isMetamaskInstalled } = useMetamaskZkpSnapContext()

  return (
    <BasicModal
      className='invalid-chain-modal'
      isShown={Boolean(
        isMetamaskInstalled &&
          isShown &&
          provider?.isConnected &&
          !isValidChain,
      )}
      updateIsShown={() => {
        /* empty */
      }}
      isCloseByClickOutside={false}
      title={`Unsupported Chain`}
      {...rest}
    >
      <div className='invalid-chain-modal__body'>
        <WrappedIcon
          className='invalid-chain-modal__icon'
          iconName={ICON_NAMES.crossedChain}
        />

        <span className='invalid-chain-modal__subtitle'>
          {`Please switch to ${
            config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN].name
          } chain in MetaMask`}
        </span>

        <div className='invalid-chain-modal__actions'>
          <AppButton
            className='invalid-chain-modal__action-btn'
            modification='border-circle'
            onClick={() =>
              requestSwitchChain(
                config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
              )
            }
            text={`Change network`}
          />
        </div>
      </div>
    </BasicModal>
  )
}

export default InvalidChainModal
