import './styles.scss'

import { AppButton } from '@/common'
import { AppButtonProps } from '@/common/AppButton'
import { Spinner } from '@/common/Loader/variants'

type Props<R extends string, H extends string> = AppButtonProps<R, H> & {
  isPending: boolean
}

const LoadingButton = <R extends string, H extends string>({
  className,
  children,
  isPending,
  ...rest
}: Props<R, H>) => {
  return (
    <AppButton
      className={[
        'loading-button',
        className,
        ...(isPending ? ['loading-button--pending'] : []),
      ].join(' ')}
      {...rest}
    >
      {isPending ? <Spinner className='loading-button__loader' /> : children}
    </AppButton>
  )
}

export default LoadingButton
