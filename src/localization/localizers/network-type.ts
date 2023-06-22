import { TFunction } from 'i18next'

import { NetworkType } from '@/enums'

export const localizeNetworkType = (t: TFunction, type: NetworkType) =>
  ({
    [NetworkType.EVM]: t('network-type.evm-lbl'),
    [NetworkType.Near]: t('network-type.near-lbl'),
    [NetworkType.Solana]: t('network-type.solana-lbl'),
    [NetworkType.Other]: t('network-type.other-lbl'),
    [NetworkType.UNRECOGNIZED]: t('network-type.unrecognized-lbl'),
  }[type])
