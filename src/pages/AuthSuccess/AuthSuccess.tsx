import './styles.scss'

import { config } from '@config'
import { FC, HTMLAttributes, useEffect, useMemo } from 'react'
import { useEffectOnce } from 'react-use'
import { useCountdown } from 'usehooks-ts'

import { AppButton, Icon } from '@/common'
import { useKycContext, useZkpContext } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { abbrCenter, copyToClipboard } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const SECOND = 1000

const REDIRECT_TIMEOUT = 30

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, x => String.fromCodePoint(x)).join('')
  return btoa(binString)
}

const AuthSuccess: FC<Props> = () => {
  const { selectedKycDetails } = useKycContext()
  const { isNaturalZkp, publishedChains, CHAINS_DETAILS_MAP } = useZkpContext()

  const [count, { startCountdown }] = useCountdown({
    countStart: REDIRECT_TIMEOUT,
    intervalMs: SECOND,
  })

  const encodedProof = useMemo(() => {
    return isNaturalZkp?.subjectProof
      ? bytesToBase64(
          new TextEncoder().encode(JSON.stringify(isNaturalZkp?.subjectProof)),
        )
      : ''
  }, [isNaturalZkp?.subjectProof])

  useEffectOnce(() => {
    startCountdown()
  })

  useEffect(() => {
    if (count > 0) return

    window.open(config.EXTERNAL_PLATFORM_REDIRECT_URL, '_blank')
  }, [count])

  return (
    <div className='auth-success'>
      <div className='auth-success__header'>
        <div className='auth-success__header-icon-wrp'>
          <Icon className='auth-success__header-icon' name={ICON_NAMES.check} />
        </div>
        <h2 className='auth-success__header-title'>{`Proof Submitted`}</h2>
      </div>

      <div className='auth-success__card'>
        {publishedChains.get?.map?.((el, idx) => (
          <div className='auth-success__card-published-item' key={idx}>
            <div className='auth-success__card-published-item-icon-wrp'>
              <Icon
                className='auth-success__card-published-item-chain-icon'
                name={CHAINS_DETAILS_MAP[el].iconName}
              />
              <div className='auth-success__card-published-item-success-icon-wrp'>
                <Icon
                  className='auth-success__card-published-item-success-icon'
                  name={ICON_NAMES.check}
                />
              </div>
            </div>
            <span className='auth-success__card-published-item-title'>
              {`Your proof has been published on ${CHAINS_DETAILS_MAP[el].title}`}
            </span>
          </div>
        ))}

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

        <div className='auth-success__card-divider-wrp'>
          <div className='auth-success__card-divider' />
        </div>

        {/*TODO: publish to another chains button*/}
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

      <AppButton
        className='auth-success__return-btn'
        text={`RETURN HOME`}
        routePath={RoutesPaths.authProviders}
      />

      <div className='auth-success__tip'>
        {`Automatically redirected in `}
        <span className='auth-success__tip-link'>{`(${count}sec)`}</span>
      </div>
    </div>
  )
}

export default AuthSuccess
