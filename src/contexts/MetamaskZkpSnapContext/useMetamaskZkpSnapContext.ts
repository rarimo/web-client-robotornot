import { useContext } from 'react'

import { MetamaskZkpSnapContext } from './MetamaskZkpSnapContext'

export const useMetamaskZkpSnapContext = () => {
  const metamaskZkpSnapContext = useContext(MetamaskZkpSnapContext)

  return {
    ...metamaskZkpSnapContext,
  }
}
