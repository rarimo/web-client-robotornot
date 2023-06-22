import { useTranslation } from 'react-i18next'

import { JsonViewer, TableCollapseRow } from '@/components'
import { ProposalFragment } from '@/types'

const ProposalOverviewContentRow = ({
  proposal,
}: {
  proposal: ProposalFragment
}) => {
  const { t } = useTranslation()

  return (
    <TableCollapseRow heading={t('proposal-overview-content-row.heading-lbl')}>
      <JsonViewer value={proposal?.content} />
    </TableCollapseRow>
  )
}

export default ProposalOverviewContentRow
