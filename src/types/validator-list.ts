export enum ValidatorListColumnIds {
  VALIDATOR = 'validator',
  VOTING_POWER = 'voting_power',
  COMMISSION = 'commission',
  CONDITION = 'condition',
  STATUS = 'status',
}

export type ValidatorListSortBy =
  | ValidatorListColumnIds.VOTING_POWER
  | ValidatorListColumnIds.COMMISSION
