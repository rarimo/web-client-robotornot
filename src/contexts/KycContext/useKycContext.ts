import { useContext } from 'react'

import { kycContext } from '@/contexts/KycContext/KycContext'

export const useKycContext = () => {
  const kycContextValue = useContext(kycContext)

  return {
    ...kycContextValue,
  }
}
