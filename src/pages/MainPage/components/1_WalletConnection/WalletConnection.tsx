import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { type FC, HTMLAttributes, useCallback } from 'react'

import { AppButton, Icon } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const WalletConnection: FC<Props> = ({ className, ...rest }) => {
  const { init } = useWeb3Context()

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [init])

  return (
    <div className={['wallet-connection', className].join(' ')} {...rest}>
      <div className='app__badge'>
        <div className='app__badge-item'>
          <Icon className='app__badge-item-icon' name={ICON_NAMES.metamask} />
        </div>

        <div className='app__badge-splitter'>
          <Icon
            className='app__badge-splitter-icon'
            name={ICON_NAMES.arrowRight}
          />
        </div>

        <div className='app__badge-item'></div>
      </div>

      <h2 className='wallet-connection__title'>
        {`Wants to know if you are a human`}
      </h2>

      <div className='app__step-actions'>
        <AppButton
          iconLeft={ICON_NAMES.metamask}
          onClick={connectProvider}
          text={`Connect metamask`}
          modification='border-circle'
        />

        <div className='app__step-actions-tip'>
          <span className='app__step-actions-tip-text'>
            {`Or press`}

            <span className='app__step-actions-tip-text--accent'>
              {`Enter`}
            </span>
          </span>
          <Icon
            className='app__step-actions-tip-icon'
            name={ICON_NAMES.arrowNarrowLeft}
          />
        </div>
      </div>
    </div>
  )
}

export default WalletConnection
