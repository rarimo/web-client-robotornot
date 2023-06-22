import { CONFIG } from '@config'
import { pubkeyToAddress, pubkeyType } from '@cosmjs/amino'

import { PubKeyModel } from '@/types'

export const addressFromPublicKey = (publicKey: PubKeyModel): string => {
  return pubkeyToAddress(
    {
      type: pubkeyType.secp256k1,
      value: publicKey.key,
    },
    CONFIG.CHAIN_ID,
  )
}
