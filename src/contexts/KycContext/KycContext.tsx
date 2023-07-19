import type { UserInfo } from '@uauth/js/build/types'
import {
  createContext,
  FC,
  HTMLAttributes,
  lazy,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
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

const KycProviderCivic = lazy(
  () => import('@/contexts/KycContext/components/KycProviderCivic'),
)

const KycProviderGitCoin = lazy(
  () => import('@/contexts/KycContext/components/KycProviderGitCoin'),
)

interface KycContextValue {
  selectedKycProviderName: SUPPORTED_KYC_PROVIDERS | undefined
  authorizedKycResponse: unknown | undefined
  selectedKycDetails: [string, string][]

  isLoaded: boolean

  isValidCredentials: boolean

  login: (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => Promise<void>
  verifyKyc: (identityIdString: string) => Promise<void>
  retryKyc: () => void
}

export const kycContext = createContext<KycContextValue>({
  selectedKycProviderName: undefined,
  authorizedKycResponse: undefined,
  selectedKycDetails: [],

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
  const { t } = useTranslation()

  const [selectedKycProviderName, setSelectedKycProviderName] =
    useState<SUPPORTED_KYC_PROVIDERS>()
  const [authorizedKycResponse, setAuthorizedKycResponse] = useState<unknown>()
  const [kycDetails, setKycDetails] = useState<unknown>()

  const selectedKycDetails = useMemo((): [string, string][] => {
    if (!selectedKycProviderName) return []

    const unstoppablePartialDetails = kycDetails as UserInfo

    const kycDetailsMap: Record<SUPPORTED_KYC_PROVIDERS, [string, string][]> = {
      [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: [
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS}.domain-lbl`,
          ),
          unstoppablePartialDetails?.sub,
        ],
      ],
      [SUPPORTED_KYC_PROVIDERS.WORDLCOIN]: [],
      [SUPPORTED_KYC_PROVIDERS.CIVIC]: [],
      [SUPPORTED_KYC_PROVIDERS.GITCOIN]: [],
    }

    return kycDetailsMap[selectedKycProviderName]
  }, [kycDetails, selectedKycProviderName, t])

  const [isLoaded, setIsLoaded] = useState(false)

  const [isValidCredentials, setIsValidCredentials] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const navigate = useNavigate()

  const { identity, createIdentity, isClaimOfferExists } = useZkpContext()

  const retryKyc = useCallback(() => {
    setIsLoaded(false)
    setRefreshKey(prev => prev + 1)
  }, [])

  const login = useCallback(
    async (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
      if (supportedKycProvider === selectedKycProviderName) {
        retryKyc()
      } else {
        setSelectedKycProviderName(supportedKycProvider)
      }
    },
    [retryKyc, selectedKycProviderName],
  )

  const verifyKyc = useCallback(
    async (identityIdString: string, _authKycResponse?: unknown) => {
      const currentAuthKycResponse = _authKycResponse ?? authorizedKycResponse

      if (!currentAuthKycResponse)
        throw new TypeError('authKycResponse is undefined')

      const VERIFY_KYC_DATA_MAP = {
        [SUPPORTED_KYC_PROVIDERS.WORDLCOIN]: {
          action: '',
          signal: '',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          nullifier_hash: currentAuthKycResponse.nullifier_hash,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          proof: currentAuthKycResponse.proof,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          merkle_root: currentAuthKycResponse.merkle_root,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          credential_type: currentAuthKycResponse.credential_type,
        },
        [SUPPORTED_KYC_PROVIDERS.CIVIC]: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          chain_name: currentAuthKycResponse.chainName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          address: currentAuthKycResponse.address,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          signature: currentAuthKycResponse.signature,
        },
        [SUPPORTED_KYC_PROVIDERS.GITCOIN]: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          address: currentAuthKycResponse.address,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          signature: currentAuthKycResponse.signature,
        },
        [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
          access_token: (currentAuthKycResponse as { accessToken: string })
            .accessToken,
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
          selectedKycDetails,

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
          setKycDetails={setKycDetails}
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.WORDLCOIN ? (
        <KycProviderWorldCoin
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
          setKycDetails={setKycDetails}
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.CIVIC ? (
        <KycProviderCivic
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
          setKycDetails={setKycDetails}
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.GITCOIN ? (
        <KycProviderGitCoin
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
          setKycDetails={setKycDetails}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default memo(KycContextProvider)
