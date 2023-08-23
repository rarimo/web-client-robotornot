import { config, SUPPORTED_CHAINS } from '@/config'
import { ICON_NAMES } from '@/enums'

export const getChainIcon = (
  chain: SUPPORTED_CHAINS,
): [boolean, string | ICON_NAMES] => {
  try {
    return [true, new URL(config.SUPPORTED_CHAINS_DETAILS[chain].icon).pathname]
  } catch (error) {
    return [
      false,
      config.SUPPORTED_CHAINS_DETAILS[chain].icon in ICON_NAMES
        ? config.SUPPORTED_CHAINS_DETAILS[chain].icon
        : ICON_NAMES.ethereum,
    ]
  }
}
