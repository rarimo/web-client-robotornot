import { BondStatus } from '@rarimo/client/lib/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/staking'
import { TFunction } from 'i18next'

export const localizeValidatorStatus = (
  t: TFunction,
  status: BondStatus,
  jailed: boolean,
) => {
  // jailed and tombstone statuses are prioritised over their unbonding state
  if (jailed) {
    return t('validator-status.jailed-lbl')
  }

  return {
    [BondStatus.BOND_STATUS_BONDED]: t('validator-status.active-lbl'),
    [BondStatus.BOND_STATUS_UNBONDING]: t('validator-status.unbonding-lbl'),
    [BondStatus.BOND_STATUS_UNBONDED]: t('validator-status.unbonded-lbl'),
    [BondStatus.UNRECOGNIZED]: t('validator-status.unrecognized-lbl'),
    [BondStatus.BOND_STATUS_UNSPECIFIED]: t('validator-status.unspecified-lbl'),
  }[status]
}
