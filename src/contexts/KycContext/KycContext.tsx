import {
  createContext,
  FC,
  HTMLAttributes,
  lazy,
  memo,
  useCallback,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '@/api'
import { useZkpContext } from '@/contexts'
import { RoutesPaths, SUPPORTED_KYC_PROVIDERS } from '@/enums'

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
  const navigate = useNavigate()

  const { identity, createIdentity } = useZkpContext()

  const [selectedKycProviderName, setSelectedKycProviderName] =
    useState<SUPPORTED_KYC_PROVIDERS>()

  const handleKycProviderComponentLogin = useCallback(
    async (response: unknown) => {
      if (!selectedKycProviderName) return

      let currentIdentity = identity

      if (!currentIdentity?.identityIdString) {
        currentIdentity = await createIdentity()
      }

      if (!currentIdentity?.identityIdString) return

      const VERIFY_KYC_DATA_MAP = {
        [SUPPORTED_KYC_PROVIDERS.WORDLCOIN]: {},
        [SUPPORTED_KYC_PROVIDERS.CIVIC]: {},
        [SUPPORTED_KYC_PROVIDERS.GITCOIN]: {},
        [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          access_token: response.accessToken,
        },
      }

      await api.post(
        `/integrations/kyc-service/v1/public/verify/${selectedKycProviderName}`,
        {
          body: {
            data: {
              type: 'verify',
              attributes: {
                identity_id: currentIdentity.identityIdString,
                provider_data: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  ...VERIFY_KYC_DATA_MAP[selectedKycProviderName],
                },
              },
            },
          },
        },
      )

      navigate(RoutesPaths.authPreview)
    },
    [createIdentity, identity, navigate, selectedKycProviderName],
  )

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
