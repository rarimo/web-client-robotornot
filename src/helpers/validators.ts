import { CONFIG } from '@config'
import { fromBech32, fromHex, toBech32 } from '@cosmjs/encoding'
import { BN } from '@distributedlab/tools'

export const maxNumber = (max: number | string) => {
  return (value?: string) => {
    const v = BN.fromBigInt(max, CONFIG.DECIMALS).fromFraction(CONFIG.DECIMALS)
    return BN.fromBigInt(value || '0', CONFIG.DECIMALS).isLessThanOrEqualTo(v)
  }
}

export const minNumber = (min: number | string) => {
  return (value?: string) => {
    const v = BN.fromBigInt(min, CONFIG.DECIMALS).fromFraction(CONFIG.DECIMALS)
    return BN.fromBigInt(value || '0', CONFIG.DECIMALS).isGreaterThanOrEqualTo(
      v,
    )
  }
}

export const cosmosAddress = (value = '') => {
  try {
    const { prefix } = fromBech32(value)
    return prefix === CONFIG.CHAIN_ID
  } catch {
    return false
  }
}

export const ipOrUrl = (value = '') => {
  return /^((https?:\/\/)|(www\.))?(?:([a-zA-Z\d.]+)|(\d+\.\d+.\d+.\d+)):\d{1,5}$/.test(
    value,
  )
}

export const hex = (value = '') => {
  try {
    value = value.replace(/^0x/, '')
    fromHex(value)
    return true
  } catch (e) {
    return false
  }
}

export const hexToBech32 = (address: string, prefix: string) => {
  const addressBuffer = fromHex(address)
  return toBech32(prefix, addressBuffer)
}
