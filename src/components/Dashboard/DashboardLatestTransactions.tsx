import { time } from '@distributedlab/tools'
import { Link } from '@mui/material'
import { DataTransferBoth } from 'iconoir-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, NavLink } from 'react-router-dom'

import { AvatarName, NoDataRow, PreviewList, RowComponent } from '@/components'
import { RoutePaths } from '@/enums'
import { addressFromPublicKey } from '@/helpers'
import { TransactionBaseFragment } from '@/types'

interface LatestTransactionsProps {
  isLoadingError: boolean
  isLoading: boolean
  transactionList: TransactionBaseFragment[]
  limitRow: number
}

const DashboardLatestTransactions = ({
  isLoading,
  isLoadingError,
  transactionList,
  limitRow,
}: LatestTransactionsProps) => {
  const { t } = useTranslation()

  const list = useMemo(() => {
    return transactionList.map(i => ({
      ...i,
      sender: addressFromPublicKey(i?.signer_infos?.[0]?.public_key) ?? '',
    }))
  }, [transactionList])

  return (
    <PreviewList
      actions={{
        label: t('transactions-list.view-all'),
        link: RoutePaths.Transactions,
      }}
      title={t('transactions-list.title')}
      isError={isLoadingError}
      isLoading={isLoading}
    >
      <>
        {!isLoading && (!transactionList.length || isLoadingError) && (
          <NoDataRow
            message={t('transactions-list.no-data-msg')}
            error={isLoadingError}
          />
        )}
        {(isLoading
          ? new Array(limitRow).fill({} as TransactionBaseFragment)
          : list
        ).map((el, idx) => (
          <RowComponent
            key={idx}
            isLoading={isLoading}
            head={
              <Link
                component={NavLink}
                to={generatePath(RoutePaths.Transaction, {
                  hash: `${el?.hash}`,
                })}
              >
                {el?.hash}
              </Link>
            }
            footer={<>{time(el.block?.timestamp, { utc: true })?.fromNow}</>}
            subfooter={
              <AvatarName
                address={el?.sender ?? ''}
                imageSize={'18px'}
                fontSize={'12px'}
                padding={0.5}
              />
            }
            subhead={<>{t('transactions-list.from')}:</>}
            icon={<DataTransferBoth width={35} height={35} />}
          />
        ))}
      </>
    </PreviewList>
  )
}
export default DashboardLatestTransactions
