import { useParams } from 'react-router-dom'

import {
  AccountDetailsSection,
  AccountTransactionsSection,
  PageContainer,
} from '@/components'
import { useAccounts, useLoading } from '@/hooks'
import { AccountModel } from '@/types'

const Account = () => {
  const { getAccountByAddress } = useAccounts()
  const { address } = useParams()

  const { data, isLoading, isLoadingError } = useLoading<
    AccountModel | undefined
  >({} as AccountModel, () => getAccountByAddress(String(address)))

  return (
    <PageContainer>
      <AccountDetailsSection />
      <>
        {Boolean(data?.pub_key) && (
          <AccountTransactionsSection
            sender={data?.pub_key}
            isAccountLoading={isLoading}
            isAccountLoadingError={isLoadingError}
          />
        )}
      </>
    </PageContainer>
  )
}

export default Account
