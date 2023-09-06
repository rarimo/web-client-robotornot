import { useContext } from 'react'

import { zkpContext } from '@/contexts/ZkpContext/ZkpContext'

export const useZkpContext = () => {
  const zkpContextValue = useContext(zkpContext)

  return {
    ...zkpContextValue,
  }
}
