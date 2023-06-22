import { Skeleton, TableCell, TableRow } from '@mui/material'
import { BondStatus } from '@rarimo/client/lib/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/staking'

import {
  AvatarName,
  ValidatorCondition,
  ValidatorStatus,
  ValidatorVotingPower,
} from '@/components'
import { createColumnMap, formatToPercent } from '@/helpers'
import { useValidatorStats } from '@/hooks'
import {
  SlashingParamsFragment,
  TableColumn,
  ValidatorBaseFragment,
} from '@/types'
import { ValidatorListColumnIds } from '@/types/validator-list'

const ValidatorListRow = ({
  validator,
  columns,
  slashingParams,
  bondedTokens,
  isLoading,
}: {
  columns: readonly TableColumn<ValidatorListColumnIds>[]
  validator?: ValidatorBaseFragment
  slashingParams?: SlashingParamsFragment
  bondedTokens?: string
  isLoading: boolean
}) => {
  const columnMap = createColumnMap<ValidatorListColumnIds>(columns)

  const { condition, comission } = useValidatorStats({
    missedBlocksCounter:
      validator?.validator_signing_infos?.[0]?.missed_blocks_counter,
    signedBlocksWindow: slashingParams?.params?.signed_blocks_window,
    commission: validator?.validator_commissions?.[0]?.commission ?? 0,
  })

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell
        sx={columnMap[ValidatorListColumnIds.VALIDATOR]?.sx}
        align={columnMap[ValidatorListColumnIds.VALIDATOR].align}
      >
        {isLoading ? (
          <Skeleton sx={columnMap[ValidatorListColumnIds.VALIDATOR]?.sx} />
        ) : (
          <AvatarName
            address={validator?.validator_info?.operator_address ?? ''}
            name={validator?.validator_descriptions?.[0]?.moniker ?? ''}
            imageUrl={validator?.validator_descriptions?.[0]?.avatar_url ?? ''}
          />
        )}
      </TableCell>

      <TableCell
        sx={columnMap[ValidatorListColumnIds.VOTING_POWER]?.sx}
        align={columnMap[ValidatorListColumnIds.VOTING_POWER].align}
      >
        {isLoading ? (
          <Skeleton sx={columnMap[ValidatorListColumnIds.VOTING_POWER]?.sx} />
        ) : (
          <ValidatorVotingPower
            votingPower={validator?.validator_voting_powers?.[0]?.voting_power}
            bondedTokens={bondedTokens}
          />
        )}
      </TableCell>

      <TableCell
        sx={columnMap[ValidatorListColumnIds.COMMISSION]?.sx}
        align={columnMap[ValidatorListColumnIds.COMMISSION].align}
      >
        {isLoading ? (
          <Skeleton sx={columnMap[ValidatorListColumnIds.COMMISSION]?.sx} />
        ) : (
          formatToPercent(comission)
        )}
      </TableCell>

      <TableCell
        sx={columnMap[ValidatorListColumnIds.CONDITION]?.sx}
        align={columnMap[ValidatorListColumnIds.CONDITION].align}
      >
        {isLoading ? (
          <Skeleton sx={columnMap[ValidatorListColumnIds.CONDITION]?.sx} />
        ) : (
          <ValidatorCondition condition={condition} />
        )}
      </TableCell>

      <TableCell
        sx={columnMap[ValidatorListColumnIds.STATUS]?.sx}
        align={columnMap[ValidatorListColumnIds.STATUS].align}
      >
        {isLoading ? (
          <Skeleton
            height={32}
            sx={columnMap[ValidatorListColumnIds.STATUS]?.sx}
          />
        ) : (
          <ValidatorStatus
            status={
              (validator?.validator_statuses?.[0]?.status as BondStatus) ?? ''
            }
            jailed={validator?.validator_statuses?.[0]?.jailed ?? false}
          />
        )}
      </TableCell>
    </TableRow>
  )
}

export default ValidatorListRow
