import { CONFIG } from '@config'
import { BN } from '@distributedlab/tools'
import { omit } from 'lodash-es'

import { TallyResultFragment } from '@/types'

const CFG = { decimals: 18 }
const CFG_FORMAT = { decimals: 2 }
const ONE_HUNDRED = 100

export const calculateTallyResults = (tally: TallyResultFragment) => {
  const { yes, no, abstain, no_with_veto } = tally

  const total = BN.fromBigInt(yes, CONFIG.DECIMALS, CFG)
    .add(BN.fromBigInt(no, CONFIG.DECIMALS))
    .add(BN.fromBigInt(abstain, CONFIG.DECIMALS))
    .add(BN.fromBigInt(no_with_veto, CONFIG.DECIMALS))

  return Object.entries(omit(tally, '__typename')).reduce(
    (acc, [key, value]) => {
      acc[key] = BN.fromBigInt(ONE_HUNDRED, CONFIG.DECIMALS, CFG)
        .mul(
          BN.fromBigInt(value, CONFIG.DECIMALS, CFG).div(
            total.toString() === '0'
              ? BN.fromBigInt(1, CONFIG.DECIMALS)
              : total,
          ),
        )
        .format(CFG_FORMAT)
        .toString()

      return acc
    },
    {} as Record<string, string>,
  )
}
