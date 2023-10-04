import './styles.scss'

import { config } from '@config'
import { Chain, errors, PROVIDERS } from '@distributedlab/w3p'
import { type FC, useCallback, useEffect, useMemo } from 'react'

import { AppButton, Icon } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const WalletConnection: FC<StepProps> = ({
  nextStepCb,
  className,
  ...rest
}) => {
  const { provider, isValidChain, init } = useWeb3Context()

  const Title = useMemo(
    () =>
      !provider?.isConnected ? (
        <>{`Wants to know if you are a human`}</>
      ) : isValidChain ? (
        <></>
      ) : (
        <>{`Please switch to ${
          config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN].name
        } chain in MetaMask`}</>
      ),
    [isValidChain, provider?.isConnected],
  )

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [init])

  const requestAddChain = useCallback(
    async (chain: Chain) => {
      try {
        await provider?.addChain?.(chain)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
    [provider],
  )

  const requestSwitchChain = useCallback(
    async (chain: Chain) => {
      try {
        await provider?.switchChain?.(Number(chain.id))
      } catch (error) {
        if (error instanceof errors.ProviderChainNotFoundError) {
          await requestAddChain(chain)

          return
        }

        throw error
      }
    },
    [provider, requestAddChain],
  )

  useEffect(() => {
    if (!provider?.isConnected || !isValidChain) return

    nextStepCb()
  }, [isValidChain, nextStepCb, provider?.isConnected])

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

      <h2 className='wallet-connection__title'>{Title}</h2>

      <div className='app__step-actions'>
        {provider?.isConnected ? (
          isValidChain ? (
            <></>
          ) : (
            <AppButton
              text={`Switch chain`}
              modification='border-circle'
              onClick={() =>
                requestSwitchChain(
                  config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
                )
              }
            />
          )
        ) : (
          <AppButton
            iconLeft={ICON_NAMES.metamask}
            text={`Connect metamask`}
            modification='border-circle'
            onClick={connectProvider}
          />
        )}

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
