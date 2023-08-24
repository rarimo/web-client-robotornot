import './styles.scss'

import { config } from '@config'
import { FC, HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useCountdown } from 'usehooks-ts'

import { AppButton, ChainIcon, Icon } from '@/common'
import { useKycContext, useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, bytesToBase64, copyToClipboard } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const SECOND = 1000

const REDIRECT_TIMEOUT = 30

const AuthSuccess: FC<Props> = () => {
  const { selectedKycDetails } = useKycContext()
  const { zkProof, publishedChains } = useZkpContext()
  const [isManualRedirected, setIsManualRedirected] = useState(false)

  const [count, { startCountdown }] = useCountdown({
    countStart: REDIRECT_TIMEOUT,
    intervalMs: SECOND,
  })

  const encodedProof = useMemo(() => {
    return zkProof
      ? bytesToBase64(new TextEncoder().encode(JSON.stringify(zkProof)))
      : ''
  }, [zkProof])

  useEffectOnce(() => {
    startCountdown()
  })

  useEffect(() => {
    if (count > 0) return

    if (!config.EXTERNAL_PLATFORM_REDIRECT_URL || isManualRedirected) return

    window.open(config.EXTERNAL_PLATFORM_REDIRECT_URL, '_blank')
  }, [count, isManualRedirected])

  return (
    <div className='auth-success'>
      <div className='auth-success__header'>
        <div className='auth-success__header-icon-wrp'>
          <Icon className='auth-success__header-icon' name={ICON_NAMES.check} />
        </div>
        <h2 className='auth-success__header-title'>{`Proof Submitted`}</h2>
        <h2 className='auth-success__header-subtitle'>
          {`You've proven your humanity! Now you can claim the reward.`}
        </h2>
      </div>

      <div className='auth-success__card'>
        {publishedChains.get?.map?.((el, idx) => (
          <div className='auth-success__card-published-item' key={idx}>
            <div className='auth-success__card-published-item-icon-wrp'>
              <ChainIcon
                className='auth-success__card-published-item-chain-icon'
                chain={el}
              />
              <div className='auth-success__card-published-item-success-icon-wrp'>
                <Icon
                  className='auth-success__card-published-item-success-icon'
                  name={ICON_NAMES.check}
                />
              </div>
            </div>
            <span className='auth-success__card-published-item-title'>
              {`Your proof has been published on ${config.SUPPORTED_CHAINS_DETAILS[el].name} chain`}
            </span>
          </div>
        ))}

        <div className='auth-success__card-divider-wrp'>
          <div className='auth-success__card-divider' />
        </div>

        <span className='auth-success__card-title'>{`Your Zero-Knowledge proof, just in case`}</span>

        <div className='auth-success__copy-field-wrp'>
          <div className='auth-success__copy-field'>
            {abbrCenter(encodedProof, 10)}
            <AppButton
              scheme='none'
              modification='none'
              size='none'
              iconLeft={ICON_NAMES.duplicate}
              onClick={() => copyToClipboard(encodedProof)}
            />
          </div>
        </div>
      </div>

      <div className='auth-success__card'>
        <div className='auth-success__metadata'>
          {selectedKycDetails?.map(([label, value], idx) => (
            <div className='auth-success__metadata-item' key={idx}>
              <span className='auth-success__metadata-item-label'>{label}</span>
              <span className='auth-success__metadata-item-value'>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {config.EXTERNAL_PLATFORM_REDIRECT_URL ? (
        <>
          <AppButton
            className='auth-success__return-btn'
            text={`RETURN TO QUEST`}
            onClick={() => {
              window.open(config.EXTERNAL_PLATFORM_REDIRECT_URL, '_blank')
              setIsManualRedirected(true)
            }}
          />

          {isManualRedirected ? (
            <></>
          ) : (
            <div className='auth-success__tip'>
              {count ? (
                <>
                  {`Automatically redirected in `}
                  <span className='auth-success__tip-link'>{`(${count}sec)`}</span>
                </>
              ) : (
                <>
                  {`Haven't redirect? `}
                  <a
                    className='auth-success__tip-link'
                    style={{ textDecoration: 'underline' }}
                    href={config.EXTERNAL_PLATFORM_REDIRECT_URL}
                    target='_blank'
                    rel='noreferrer'
                  >{`click here`}</a>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default AuthSuccess
