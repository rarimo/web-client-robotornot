import {
  createContext,
  FC,
  HTMLAttributes,
  lazy,
  memo,
  useCallback,
  useState,
} from 'react'

import { SUPPORTED_KYC_PROVIDERS } from '@/enums'

const KycProviderUnstoppableDomains = lazy(
  () =>
    import('@/contexts/KycContext/components/KycProviderUnstoppableDomains'),
)

const KycProviderWorldCoin = lazy(
  () => import('@/contexts/KycContext/components/KycProviderWorldCoin'),
)

interface KycContextValue {
  login: (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => Promise<void>
}

export const kycContext = createContext<KycContextValue>({
  login: (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
    throw new TypeError(`login not implemented for ${supportedKycProvider}`)
  },
})

const KycContextProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  const [selectedKycProviderName, setSelectedKycProviderName] =
    useState<SUPPORTED_KYC_PROVIDERS>()

  const handleKycProviderComponentLogin = useCallback((response: unknown) => {
    // eslint-disable-next-line no-console
    console.log('handleKycProviderComponentLogin', response)
  }, [])

  const login = useCallback(
    async (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
      setSelectedKycProviderName(supportedKycProvider)
    },
    [],
  )

  return (
    <>
      <kycContext.Provider
        {...rest}
        value={{
          login,
        }}
      >
        {children}
      </kycContext.Provider>

      {selectedKycProviderName ===
      SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS ? (
        <KycProviderUnstoppableDomains
          loginCb={handleKycProviderComponentLogin}
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.WORDLCOIN ? (
        <KycProviderWorldCoin loginCb={handleKycProviderComponentLogin} />
      ) : (
        <></>
      )}
    </>
  )
}

export default memo(KycContextProvider)
