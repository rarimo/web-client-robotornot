import { CONFIG } from '@config'

export const getDenom = (
  list: { denom: string; amount: string | number }[] = [],
  denom = CONFIG.DENOM,
) => {
  const selectedDenom = list?.find(
    x => x?.denom?.toUpperCase() === denom?.toUpperCase(),
  )

  return {
    denom: selectedDenom?.denom ?? denom,
    amount: selectedDenom?.amount ?? '0',
  }
}
