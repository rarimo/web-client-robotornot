import { CONFIG } from '@config'
import { ChainInfo } from '@keplr-wallet/types'

export const KEPLR_CHAIN_INFO: Partial<ChainInfo> = {
  stakeCurrency: {
    coinDenom: CONFIG.DENOM,
    coinMinimalDenom: CONFIG.MINIMAL_DENOM,
    coinDecimals: CONFIG.DECIMALS,
  },
  currencies: [
    {
      coinDenom: CONFIG.DENOM,
      coinMinimalDenom: CONFIG.MINIMAL_DENOM,
      coinDecimals: CONFIG.DECIMALS,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: CONFIG.DENOM,
      coinMinimalDenom: CONFIG.MINIMAL_DENOM,
      coinDecimals: CONFIG.DECIMALS,
      gasPriceStep: {
        low: Number(CONFIG.GAS_PRICE_STEP_LOW),
        average: Number(CONFIG.GAS_PRICE_STEP_AVG),
        high: Number(CONFIG.GAS_PRICE_STEP_HIGH),
      },
    },
  ],
}
