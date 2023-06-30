import { useContext } from 'react'

import { kycContext } from '@/contexts'

export const useKycContext = () => {
  const kycContextValue = useContext(kycContext)

  return {
    ...kycContextValue,
  }
}
