import './styles.scss'

import { config } from '@config'
import { FC, HTMLAttributes, useEffect, useMemo } from 'react'
import { useEffectOnce } from 'react-use'
import { useCountdown } from 'usehooks-ts'

import { AppButton, Icon } from '@/common'
import { useKycContext, useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
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
  const { isNaturalZkp } = useZkpContext()

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
        <div className='auth-success__metadata'>
          {selectedKycDetails?.map(([label, value], idx) => (
            <div className='auth-success__metadata-item' key={idx}>
              <span className='auth-success__metadata-item-label'>{label}</span>
              <span className='auth-success__metadata-item-value'>{value}</span>
            </div>
          ))}
        </div>

        <div className='auth-success__card-divider' />

        <span className='auth-success__card-title'>{`Share manually`}</span>

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

      <div className='auth-success__tip'>
        {`Automatically redirected in `}
        <span className='auth-success__tip-link'>{`(${count}sec)`}</span>
      </div>
    </div>
  )
}

export default AuthSuccess
