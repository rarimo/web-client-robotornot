import { IDKitWidget, ISuccessResult, useIDKit } from '@worldcoin/idkit'
import { FC, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

const KycProviderUnstoppableDomains: FC<Props> = ({ loginCb }) => {
  const { setOpen } = useIDKit()
  setOpen(true)

  return (
    <IDKitWidget
      app_id='app_staging_9fb8292c0c09024ffa05c070d86ef7d3'
      action=''
      enableTelemetry
      onSuccess={(result: ISuccessResult) => loginCb(result)}
    />
  )
}

export default KycProviderUnstoppableDomains
