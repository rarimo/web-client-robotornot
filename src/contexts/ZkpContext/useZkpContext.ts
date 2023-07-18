import { useContext } from 'react'

import { zkpContext } from '@/contexts'

export const useZkpContext = () => {
  const zkpContextValue = useContext(zkpContext)

  return {
    ...zkpContextValue,
  }
}
