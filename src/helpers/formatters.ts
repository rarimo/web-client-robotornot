import { CONFIG } from '@config'
import { BN, BnFormatCfg, BnLike } from '@distributedlab/tools'

export const AMOUNT_CFG: BnFormatCfg = {
  decimals: CONFIG.AMOUNT_DECIMALS,
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
}

export const formatSeconds = (value?: BnLike) => {
  return BN.fromBigInt(value ?? 0, CONFIG.DECIMALS).format({
    decimals: CONFIG.AMOUNT_DECIMALS,
    suffix: 's',
  })
}
export const formatNanoToMilliseconds = (value: number) => {
  return Number(
    BN.fromBigInt(value ?? 0, CONFIG.DECIMALS)
      .div(BN.fromBigInt(CONFIG.NANO_IN_MILLISECONDS, CONFIG.DECIMALS))
      .toString(),
  )
}

export const formatToPercent = (value?: BnLike) => {
  return BN.fromBigInt(value ?? '0', CONFIG.WEI_DECIMALS).format({
    decimals: CONFIG.PERCENT_DECIMALS,
    suffix: '%',
  })
}

export const formatCurrency = (
  amount?: BnLike,
  config: BnFormatCfg = { decimals: CONFIG.AMOUNT_DECIMALS },
) => {
  return BN.fromBigInt(amount ?? '0', CONFIG.DECIMALS)
    .fromFraction(CONFIG.DECIMALS)
    .format({
      ...config,
    })
}

export const formatAmount = (
  amount?: BnLike,
  config: BnFormatCfg = AMOUNT_CFG,
) => {
  return BN.fromBigInt(amount ?? '0', CONFIG.DECIMALS).format({
    ...config,
  })
}

export const formatCurrencyWithDenom = (
  amount?: BnLike,
  denom: string = CONFIG.DENOM,
) => {
  return formatCurrency(amount, {
    ...AMOUNT_CFG,
    suffix: ' ' + denom.toUpperCase(),
  })
}
