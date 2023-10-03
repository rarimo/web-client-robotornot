import { config } from '@config'
import { type JsonApiError } from '@distributedlab/jac'
import { W3CCredential } from '@rarimo/rarime-connector'
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
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { api } from '@/api'
import { useZkpContext } from '@/contexts'
import type { QueryVariableName } from '@/contexts/ZkpContext/ZkpContext'
import { ICON_NAMES, RoutesPaths, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import {
  abbrCenter,
  ErrorHandler,
  localizeUnauthorizedError,
  sleep,
} from '@/helpers'

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

const KYC_PROVIDERS_DETAILS_MAP: Record<
  SUPPORTED_KYC_PROVIDERS,
  {
    name: string
    iconName: ICON_NAMES
    link: string
    isWalletRequired: boolean

    completeKycCb?: () => void
    completeKycMessage?: string
  }
> = {
  [SUPPORTED_KYC_PROVIDERS.CIVIC]: {
    name: 'Civic',
    iconName: ICON_NAMES.providerCivic,
    link: 'https://getpass.civic.com/',
    isWalletRequired: true,
  },
  [SUPPORTED_KYC_PROVIDERS.GITCOIN]: {
    name: 'Gitcoin Passport',
    iconName: ICON_NAMES.providerGitCoin,
    link: 'https://passport.gitcoin.co/',
    isWalletRequired: true,

    completeKycCb: () => {
      window.open('https://passport.gitcoin.co/', '_blank')
    },
    completeKycMessage: 'Complete your Gitcoin Passport',
  },
  [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
    name: 'Unstoppable domains',
    iconName: ICON_NAMES.providerUnstoppable,
    link: 'https://unstoppabledomains.com/auth',
    isWalletRequired: true,
  },
  [SUPPORTED_KYC_PROVIDERS.WORLDCOIN]: {
    name: 'Worldcoin',
    iconName: ICON_NAMES.providerWorldCoin,
    link: 'https://worldcoin.org/download-app',
    isWalletRequired: true,
  },
}

interface KycContextValue {
  authorizedKycResponse: unknown | undefined
  selectedKycDetails: [string, string][]
  kycError?: JsonApiError
  verificationErrorMessages: string

  KYC_PROVIDERS_DETAILS_MAP: typeof KYC_PROVIDERS_DETAILS_MAP

  isKycFinished: boolean
  isValidCredentials: boolean
  isVCRequestPending: boolean

  login: (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => Promise<void>
  verifyKyc: (identityIdString: string) => Promise<void>
  retryKyc: () => void
}

type GitCoinPassportUserInfo = {
  address: string
  score: string
  stamps: {
    version: string
    metadata: {
      group: string
      platform: {
        id: string
        icon: string
        name: string
        description: string
        connectMessage: string
      }
      name: string
      description: string
      hash: string
    }
  }[]
}

export const kycContext = createContext<KycContextValue>({
  authorizedKycResponse: undefined,
  selectedKycDetails: [],
  verificationErrorMessages: '',

  KYC_PROVIDERS_DETAILS_MAP,

  isKycFinished: false,
  isValidCredentials: false,
  isVCRequestPending: false,

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
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [authorizedKycResponse, setAuthorizedKycResponse] = useState<unknown>()
  const [isKycFinished, setIsKycFinished] = useState(false)

  const {
    selectedKycProvider,

    identityIdString,
    verifiableCredentials,

    createIdentity,
    isClaimOfferExists,
    getVerifiableCredentials,
  } = useZkpContext()

  const kycDetails = useMemo<
    | Partial<
        | {
            address: string
            civicGatekeeperNetworkId: number
            gitcoinPassportScore: string
            id: string
            kycAdditionalData: string
            provider: string
            type: string
            unstoppableDomain: string
            worldcoinScore: string
          } & QueryVariableName
      >
    | undefined
  >(
    () => verifiableCredentials?.credentialSubject,
    [verifiableCredentials?.credentialSubject],
  )

  const selectedKycDetails = useMemo((): [string, string][] => {
    if (!selectedKycProvider.get) return []

    const unstoppablePartialDetails = kycDetails as unknown as UserInfo

    const gitCoinPassportPartialDetails = (kycDetails?.kycAdditionalData &&
    kycDetails?.kycAdditionalData !== 'none'
      ? JSON.parse(kycDetails?.kycAdditionalData as string)
      : {}) as unknown as GitCoinPassportUserInfo

    const civicPartialDetails = kycDetails as unknown as {
      address?: string
    }

    const worldcoinPartialDetails = (kycDetails?.kycAdditionalData &&
    kycDetails?.kycAdditionalData !== 'none'
      ? JSON.parse(kycDetails?.kycAdditionalData as string)
      : {}) as unknown as { sub: string }

    const kycDetailsMap: Record<SUPPORTED_KYC_PROVIDERS, [string, string][]> = {
      [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: [
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS}.domain-lbl`,
          ),
          kycDetails?.unstoppableDomain || unstoppablePartialDetails?.sub,
        ],
      ],
      [SUPPORTED_KYC_PROVIDERS.WORLDCOIN]: [
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.WORLDCOIN}.score-lbl`,
          ),
          kycDetails?.worldcoinScore ?? '',
        ],
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.WORLDCOIN}.sub-lbl`,
          ),
          worldcoinPartialDetails?.sub
            ? abbrCenter(worldcoinPartialDetails?.sub)
            : '',
        ],
      ],
      [SUPPORTED_KYC_PROVIDERS.CIVIC]: [
        ...(civicPartialDetails?.address &&
        civicPartialDetails?.address !== 'none'
          ? [
              [
                t(
                  `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.CIVIC}.address-lbl`,
                ),
                abbrCenter(civicPartialDetails?.address),
              ] as [string, string],
            ]
          : []),
      ],
      [SUPPORTED_KYC_PROVIDERS.GITCOIN]: [
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.GITCOIN}.address-lbl`,
          ),
          gitCoinPassportPartialDetails?.address
            ? abbrCenter(gitCoinPassportPartialDetails?.address)
            : '',
        ],
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.GITCOIN}.score-lbl`,
          ),
          gitCoinPassportPartialDetails?.score,
        ],
        ...(gitCoinPassportPartialDetails?.stamps?.map<[string, string]>(
          ({ metadata }) => [
            metadata?.platform?.id,
            ['Encrypted', metadata?.platform?.id].includes(
              metadata?.description,
            )
              ? 'Confirmed'
              : metadata?.description,
          ],
        ) ?? []),
      ],
    }

    return kycDetailsMap[selectedKycProvider.get]
  }, [kycDetails, selectedKycProvider?.get, t])

  const [isVCRequestPending, setIsVCRequestPending] = useState(false)

  const [isValidCredentials, setIsValidCredentials] = useState(true)

  const [refreshKey, setRefreshKey] = useState(0)

  const [kycError, setKycError] = useState<JsonApiError>()

  const verificationErrorMessages = useMemo(() => {
    switch (kycError?.httpStatus) {
      case 401:
        return localizeUnauthorizedError(kycError)
      case 409:
        return t(
          'This KYC provider / Address was already claimed by another identity',
        )
      default:
        return ''
    }
  }, [kycError, t])

  const navigate = useNavigate()

  const retryKyc = useCallback(() => {
    setIsVCRequestPending(false)
    setRefreshKey(prev => prev + 1)
  }, [])

  const login = useCallback(
    async (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
      if (supportedKycProvider === selectedKycProvider?.get) {
        retryKyc()
      } else {
        selectedKycProvider.set(supportedKycProvider)
      }
    },
    [retryKyc, selectedKycProvider],
  )

  const handleVerificationChecking = useCallback(
    async (verificationId: string) => {
      let isPending = true

      do {
        const { data } = await api.get<{
          type: 'verify_status'
          id: 'string'
          status: 'verified' | 'unverified' | 'pending'
          user_data: unknown
        }>(`/integrations/kyc-service/v1/public/status/${verificationId}`)

        switch (data.status) {
          case 'verified':
            setAuthorizedKycResponse(data.user_data)
            isPending = false
            break
          case 'unverified':
            isPending = false
            break
          default:
            await sleep(config.KYC_VERIFICATION_DELAY)
        }
      } while (isPending)
    },
    [],
  )

  const verifyKyc = useCallback(
    async (identityIdString: string, _authKycResponse?: unknown) => {
      const currentAuthKycResponse = _authKycResponse ?? authorizedKycResponse

      if (!currentAuthKycResponse)
        throw new TypeError('authKycResponse is undefined')

      if (!selectedKycProvider.get)
        throw new TypeError('selectedKycProviderName is undefined')

      const VERIFY_KYC_DATA_MAP = {
        [SUPPORTED_KYC_PROVIDERS.WORLDCOIN]: {
          id_token: currentAuthKycResponse,
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

      const { data } = await api.post<
        | {
            type: 'user_data'
            user_data: unknown
          }
        | {
            type: 'verification_id'
            id: 'string'
          }
      >(
        `/integrations/kyc-service/v1/public/verify/${selectedKycProvider.get}`,
        {
          body: {
            data: {
              type: 'verify',
              attributes: {
                identity_id: identityIdString,
                provider_data: {
                  ...VERIFY_KYC_DATA_MAP[selectedKycProvider.get],
                },
              },
            },
          },
        },
      )

      if (!data) return

      if (data.type === 'verification_id') {
        await handleVerificationChecking(data.id)
      }
    },
    [
      authorizedKycResponse,
      handleVerificationChecking,
      selectedKycProvider?.get,
    ],
  )

  const handleKycProviderComponentLogin = useCallback(
    async (response: unknown) => {
      setAuthorizedKycResponse(response)

      navigate(RoutesPaths.authPreview)

      if (!selectedKycProvider.get) return

      let currentIdentityIdString = identityIdString

      if (!currentIdentityIdString) {
        currentIdentityIdString = (await createIdentity()) ?? ''
      }

      if (!currentIdentityIdString) return

      try {
        if (!(await isClaimOfferExists(currentIdentityIdString, 1))) {
          try {
            await verifyKyc(currentIdentityIdString, response)
          } catch (error) {
            setKycError(error as JsonApiError)

            ErrorHandler.processWithoutFeedback(error)

            setIsValidCredentials(false)

            setIsVCRequestPending(true)

            return
          }
        }

        setIsKycFinished(true)

        let _verifiableCredentials: W3CCredential | undefined

        try {
          await isClaimOfferExists(currentIdentityIdString)

          _verifiableCredentials = await getVerifiableCredentials(
            currentIdentityIdString,
          )
        } catch (error) {
          ErrorHandler.process(error)
        }

        setIsValidCredentials(!!_verifiableCredentials?.id)

        setIsVCRequestPending(true)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        navigate(RoutesPaths.authProviders)
      }

      return
    },
    [
      createIdentity,
      getVerifiableCredentials,
      identityIdString,
      isClaimOfferExists,
      navigate,
      selectedKycProvider.get,
      verifyKyc,
    ],
  )

  useEffectOnce(() => {
    // FIXME: hotfix due to worldcoin redirect link respond
    if (window.location.href.includes('providers#id_token')) {
      window.open(
        window.location.href.replace(
          'providers#id_token',
          'providers?id_token',
        ),
        '_self',
        'noopener,noreferrer',
      )
    }

    if (searchParams.get('id_token')) {
      login(SUPPORTED_KYC_PROVIDERS.WORLDCOIN)
    }
  })

  return (
    <>
      <kycContext.Provider
        {...rest}
        value={{
          authorizedKycResponse,
          selectedKycDetails,
          kycError,
          verificationErrorMessages,

          KYC_PROVIDERS_DETAILS_MAP,

          isKycFinished,
          isValidCredentials,
          isVCRequestPending,

          login,
          verifyKyc,
          retryKyc,
        }}
      >
        {children}
      </kycContext.Provider>

      {verifiableCredentials ? (
        <></>
      ) : (
        <>
          {selectedKycProvider?.get ===
          SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS ? (
            <KycProviderUnstoppableDomains
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
            />
          ) : selectedKycProvider?.get === SUPPORTED_KYC_PROVIDERS.WORLDCOIN ? (
            <KycProviderWorldCoin
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
            />
          ) : selectedKycProvider?.get === SUPPORTED_KYC_PROVIDERS.CIVIC ? (
            <KycProviderCivic
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
            />
          ) : selectedKycProvider?.get === SUPPORTED_KYC_PROVIDERS.GITCOIN ? (
            <KycProviderGitCoin
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  )
}

export default memo(KycContextProvider)
