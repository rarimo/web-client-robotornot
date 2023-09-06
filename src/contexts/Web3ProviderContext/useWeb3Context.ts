import { useContext } from 'react'

import { web3ProviderContext } from '@/contexts/Web3ProviderContext/Web3ProviderContext'

export const useWeb3Context = () => {
  const web3ProviderContextValue = useContext(web3ProviderContext)

  return {
    ...web3ProviderContextValue,
  }
}
