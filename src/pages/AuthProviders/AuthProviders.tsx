import './styles.scss'

import { FC, HTMLAttributes, useCallback } from 'react'
import { useEffectOnce } from 'react-use'
import { useSnapshot } from 'valtio'

import { identityStore } from '@/store'

type Props = HTMLAttributes<HTMLDivElement>

const AuthProviders: FC<Props> = () => {
  const identityStoreSnap = useSnapshot(identityStore)

  const init = useCallback(async () => {
    await identityStoreSnap.init()
  }, [identityStoreSnap])

  useEffectOnce(() => {
    init()
  })

  return <div className='auth-providers'></div>
}

export default AuthProviders
