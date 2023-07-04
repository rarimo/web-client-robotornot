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
  selectedKycProviderName: SUPPORTED_KYC_PROVIDERS | undefined
  authorizedKycResponse: unknown | undefined

  isLoaded: boolean

  isValidCredentials: boolean

  login: (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => Promise<void>
  verifyKyc: (identityIdString: string) => Promise<void>
  retryKyc: () => void
}

export const kycContext = createContext<KycContextValue>({
  selectedKycProviderName: undefined,
  authorizedKycResponse: undefined,

  isLoaded: false,

  isValidCredentials: false,

  login: (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
    throw new TypeError(`login not implemented for ${supportedKycProvider}`)
  },
  verifyKyc: (identityIdString: string) => {
    throw new TypeError(`verifyKyc not implemented for ${identityIdString}`)
  },
  retryKyc: () => {
    throw new TypeError(`retryKyc not implemented`)
  },
})

const KycContextProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  const [selectedKycProviderName, setSelectedKycProviderName] =
    useState<SUPPORTED_KYC_PROVIDERS>()
  const [authorizedKycResponse, setAuthorizedKycResponse] = useState<unknown>()

  const [isLoaded, setIsLoaded] = useState(false)

  const [isValidCredentials, setIsValidCredentials] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const navigate = useNavigate()

  const { identity, createIdentity, isClaimOfferExists } = useZkpContext()

  const login = useCallback(
    async (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
      setSelectedKycProviderName(supportedKycProvider)
    },
    [],
  )

  const verifyKyc = useCallback(
    async (identityIdString: string, _authKycResponse?: unknown) => {
      const currentAuthKycResponse = _authKycResponse ?? authorizedKycResponse

      if (!currentAuthKycResponse)
        throw new TypeError('authKycResponse is undefined')

      const VERIFY_KYC_DATA_MAP = {
        [SUPPORTED_KYC_PROVIDERS.WORDLCOIN]: {},
        [SUPPORTED_KYC_PROVIDERS.CIVIC]: {},
        [SUPPORTED_KYC_PROVIDERS.GITCOIN]: {},
        [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          access_token: currentAuthKycResponse.accessToken,
        },
      }

      await api.post(
        `/integrations/kyc-service/v1/public/verify/${selectedKycProviderName}`,
        {
          body: {
            data: {
              type: 'verify',
              attributes: {
                identity_id: identityIdString,
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
    },
    [authorizedKycResponse, selectedKycProviderName],
  )

  const retryKyc = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const handleKycProviderComponentLogin = useCallback(
    async (response: unknown) => {
      setAuthorizedKycResponse(response)

      navigate(RoutesPaths.authPreview)

      if (!selectedKycProviderName) return

      let currentIdentity = identity

      if (!currentIdentity?.idString) {
        currentIdentity = await createIdentity()
      }

      if (!currentIdentity?.idString) return

      if (!(await isClaimOfferExists(currentIdentity))) {
        try {
          await verifyKyc(currentIdentity.idString, response)
        } catch (error) {
          setIsValidCredentials(false)

          setIsLoaded(true)

          return
        }
      }

      setIsValidCredentials(await isClaimOfferExists(currentIdentity))

      setIsLoaded(true)

      return
    },
    [
      createIdentity,
      identity,
      isClaimOfferExists,
      navigate,
      selectedKycProviderName,
      verifyKyc,
    ],
  )

  return (
    <>
      <kycContext.Provider
        {...rest}
        value={{
          selectedKycProviderName,
          authorizedKycResponse,

          isLoaded,
          isValidCredentials,

          login,
          verifyKyc,
          retryKyc,
        }}
      >
        {children}
      </kycContext.Provider>

      {selectedKycProviderName ===
      SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS ? (
        <KycProviderUnstoppableDomains
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.WORDLCOIN ? (
        <KycProviderWorldCoin
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default memo(KycContextProvider)
