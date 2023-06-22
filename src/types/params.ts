import { Coin } from '@cosmjs/stargate'
export type StakingParamsType = {
  bond_denom: string
  unbonding_time: number
  max_entries: number
  historical_entries: number
  max_validators: number
}

export type SlashingParamsType = {
  downtime_jail_duration: number
  min_signed_per_window: number
  signed_blocks_window: number
  slash_fraction_double_sign: number
  slash_fraction_downtime: number
}

export type MintingParamsType = {
  blocks_per_year: number
  goal_bonded: number
  inflation_max: number
  inflation_min: number
  inflation_rate_change: number
  mint_denom: string
}

export type DistributionParamsType = {
  base_proposer_reward: number
  bonus_proposer_reward: number
  community_tax: number
  withdraw_addr_enabled: boolean
}

export type DepositParams = {
  min_deposit: Coin[]
  max_deposit_period: number
}
export type TallyParams = {
  quorum: number
  threshold: number
  veto_threshold: number
}
export type VotingParams = {
  voting_period: number
}
