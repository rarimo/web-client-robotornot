import { useContext } from 'react'

import { web3ProviderContext } from '@/contexts'

export const useWeb3Context = () => {
  const web3ProviderContextValue = useContext(web3ProviderContext)

  return {
    ...web3ProviderContextValue,
  }
}
