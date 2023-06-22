import { Skeleton } from '@mui/material'
import { V1Beta1Coin } from '@rarimo/client/lib/cosmos.bank.v1beta1/rest'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import {
  ContentBox,
  ContentSection,
  ContentWrapper,
  CopyToClipboardWrapper,
  OverviewTable,
} from '@/components'
import { formatCurrencyWithDenom } from '@/helpers'
import { useAccounts, useLoading } from '@/hooks'

const AccountDetailsSection = () => {
  const { address } = useParams()
  const { getAccountBalanceByAddress } = useAccounts()
  const { t } = useTranslation()

  const { data, isLoading, isLoadingError, isEmpty } = useLoading<
    V1Beta1Coin | undefined
  >({}, () => getAccountBalanceByAddress(String(address)))

  const rows = [
    {
      head: t('account-details-section.address-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        <CopyToClipboardWrapper value={address}>
          {address}
        </CopyToClipboardWrapper>
      ),
    },
    {
      head: t('account-details-section.balance-lbl'),
      body: isLoading ? (
        <Skeleton width={'100%'} />
      ) : (
        formatCurrencyWithDenom(data?.amount)
      ),
    },
  ]

  return (
    <ContentSection
      withBackButton
      title={t('account-details-section.title-lbl')}
    >
      <ContentBox>
        <ContentWrapper>
          <OverviewTable
            label={t('account-details-section.title-lbl')}
            noDataMessage={t('account-details-section.no-data-msg')}
            isEmpty={isEmpty}
            isLoadingError={isLoadingError}
            rows={rows}
          />
        </ContentWrapper>
      </ContentBox>
    </ContentSection>
  )
}

export default AccountDetailsSection
