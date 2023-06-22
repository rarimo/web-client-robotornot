import { Coin } from '@cosmjs/amino'

type ValidatorDelegationBase = {
  delegator_address: string
  validator_address: string
}

export type ValidatorDelegation = ValidatorDelegationBase & {
  coins: Coin[]
}

export type ValidatorEntry = {
  balance: string
  completion_time: string
  creation_height?: number
  initial_balance?: string
}

export type ValidatorRedelegation = {
  entries: ValidatorEntry[]
  validator_dst_address: string
  delegator_address: string
  validator_src_address: string
}

export type ValidatorUnbondingDelegation = ValidatorDelegationBase & {
  entries: ValidatorEntry[]
}
