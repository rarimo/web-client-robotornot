import { CONFIG } from '@config'
import { BN, BnLike } from '@distributedlab/tools'
import { useMemo } from 'react'

const ONE_HUNDRED_PERCENT = 100

export const useValidatorStats = ({
  missedBlocksCounter,
  signedBlocksWindow,
  commission,
}: {
  missedBlocksCounter: BnLike
  signedBlocksWindow: BnLike
  commission: BnLike
}) => {
  const condition = useMemo(() => {
    if (!missedBlocksCounter) return 100
    if (!signedBlocksWindow) return 0

    const missedBlocksBN = BN.fromRaw(missedBlocksCounter, CONFIG.DECIMALS)
    const signedBlocksWindowBN = BN.fromRaw(signedBlocksWindow, CONFIG.DECIMALS)

    const result = signedBlocksWindowBN.isZero
      ? 0
      : BN.fromRaw(ONE_HUNDRED_PERCENT, CONFIG.DECIMALS)
          .sub(missedBlocksBN.div(signedBlocksWindowBN))
          .toString()

    return Number(result)
  }, [missedBlocksCounter, signedBlocksWindow])

  const _comission = useMemo(() => {
    if (!commission) return 0

    return BN.fromRaw(commission, CONFIG.DECIMALS).mul(
      BN.fromBigInt(ONE_HUNDRED_PERCENT, CONFIG.DECIMALS),
    )
  }, [commission])

  return { condition, comission: _comission }
}
