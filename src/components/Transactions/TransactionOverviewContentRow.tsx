import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { JsonViewer, TableCollapseRow } from '@/components'
import { TransactionFragment } from '@/types'

const TransactionOverviewContentRow = ({
  transaction,
}: {
  transaction: TransactionFragment
}) => {
  const { t } = useTranslation()

  const log = useMemo(() => {
    try {
      return JSON.parse(transaction.raw_log ?? '{}')
    } catch (e) {
      return { details: transaction.raw_log }
    }
  }, [transaction])

  return (
    <>
      <TableCollapseRow
        heading={t('transaction-overview-content-row.heading-raw-log-lbl')}
      >
        <JsonViewer value={log} />
      </TableCollapseRow>
      <TableCollapseRow
        heading={t('transaction-overview-content-row.heading-messages-lbl')}
      >
        <JsonViewer value={transaction.messages} />
      </TableCollapseRow>
    </>
  )
}

export default TransactionOverviewContentRow
