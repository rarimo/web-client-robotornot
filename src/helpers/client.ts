import { DeliverTxResponse } from '@cosmjs/stargate'

const SUCCESSFUL_TRANSACTION_CODE = 0

export const handleTxResponse = (resp: DeliverTxResponse) => {
  if (resp.code === SUCCESSFUL_TRANSACTION_CODE) return
  throw new Error(resp.rawLog)
}
