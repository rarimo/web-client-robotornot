import { config } from '@config'
import { IDKitWidget, ISuccessResult, useIDKit } from '@worldcoin/idkit'
import { FC, HTMLAttributes } from 'react'
import { useEffectOnce } from 'react-use'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
  setKycDetails: (details: unknown) => void
}

const KycProviderUnstoppableDomains: FC<Props> = ({
  loginCb,
  setKycDetails,
}) => {
  const { setOpen } = useIDKit()

  useEffectOnce(() => {
    setOpen(true)
  })

  return (
    <IDKitWidget
      app_id={config.WORLDCOIN_APP_ID}
      action=''
      enableTelemetry
      onSuccess={(result: ISuccessResult) => loginCb(result)}
    />
  )
}

export default KycProviderUnstoppableDomains
