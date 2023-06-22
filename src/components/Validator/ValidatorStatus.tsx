import { Chip } from '@mui/material'
import { BondStatus } from '@rarimo/client/lib/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/staking'

import { useLocalize } from '@/hooks'

const ValidatorStatus = ({
  status,
  jailed,
}: {
  status?: BondStatus
  jailed: boolean
}) => {
  const { localizeValidatorStatus } = useLocalize()

  const getValidatorStatusColor = (status: BondStatus, jailed: boolean) => {
    // jailed status are prioritised over their unbonding state
    if (jailed) {
      return 'error'
    }

    switch (status) {
      case BondStatus.BOND_STATUS_BONDED:
        return 'success'
      case BondStatus.BOND_STATUS_UNBONDING:
        return 'warning'
      case BondStatus.BOND_STATUS_UNBONDED:
        return 'error'
      default:
        return 'info'
    }
  }

  return (
    <Chip
      label={
        localizeValidatorStatus(
          status ?? BondStatus.BOND_STATUS_UNSPECIFIED,
          jailed,
        ) ?? ''
      }
      color={
        getValidatorStatusColor(
          status ?? BondStatus.BOND_STATUS_UNSPECIFIED,
          jailed,
        ) ?? 'primary'
      }
    />
  )
}

export default ValidatorStatus
