import { config } from '@config'
import { type JsonApiError } from '@distributedlab/jac'
import type { UserInfo } from '@uauth/js/build/types'
import {
  createContext,
  FC,
  HTMLAttributes,
  lazy,
  memo,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { api } from '@/api'
import { useZkpContext } from '@/contexts'
import type { QueryVariableName } from '@/contexts/ZkpContext/ZkpContext'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'
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

    tooltipElement: ReactElement | string
  }
> = {
  [SUPPORTED_KYC_PROVIDERS.CIVIC]: {
    name: 'Civic',
    iconName: ICON_NAMES.providerCivic,
    link: 'https://getpass.civic.com/',
    isWalletRequired: true,
    tooltipElement: (
      <span className='app__kyc-provider-item-tooltip'>
        <b>{`Civic: `}</b>
        <span>
          {`A real-time biometric verification service that performs user liveness checks through camera scans`}
        </span>
      </span>
    ),
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
    tooltipElement: (
      <span className='app__kyc-provider-item-tooltip'>
        <b>{`Gitcoin Passport: `}</b>
        <span>
          {`An identity system based on Stamps. Users need to achieve a profile score beyond a 15% threshold.`}
        </span>
      </span>
    ),
  },
  [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
    name: 'Unstoppable domains',
    iconName: ICON_NAMES.providerUnstoppable,
    link: 'https://unstoppabledomains.com/auth',
    isWalletRequired: true,
    tooltipElement: (
      <span className='app__kyc-provider-item-tooltip'>
        <b>{`Unstoppable Domains: `}</b>
        <span>
          {`An ownership-based identity service. Users receive credentials upon purchasing specific on-chain domains such as .eth, .polygon, .x.`}
        </span>
      </span>
    ),
  },
  [SUPPORTED_KYC_PROVIDERS.WORLDCOIN]: {
    name: 'Worldcoin',
    iconName: ICON_NAMES.providerWorldCoin,
    link: 'https://worldcoin.org/download-app',
    isWalletRequired: true,
    tooltipElement: (
      <span className='app__kyc-provider-item-tooltip'>
        <b>{`WordCoin: `}</b>
        <span>
          {`Through WorldID, identities are established using “The Orb,” which scans users' irises. This offers a high-security method for establishing an on-chain identity.`}
        </span>
      </span>
    ),
  },
}

interface KycContextValue {
  selectedKycProvider?: SUPPORTED_KYC_PROVIDERS

  authorizedKycResponse: unknown | undefined
  selectedKycDetails: [string, string][]
  kycError?: JsonApiError
  verificationErrorMessages: string

  KYC_PROVIDERS_DETAILS_MAP: typeof KYC_PROVIDERS_DETAILS_MAP

  isVCRequestPending: boolean
  isVCRequestFailed: boolean

  isKycFinished: boolean

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

  isVCRequestPending: false,
  isVCRequestFailed: false,

  isKycFinished: false,

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
  const [selectedKycProvider, setSelectedKycProvider] =
    useState<SUPPORTED_KYC_PROVIDERS>()

  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [authorizedKycResponse, setAuthorizedKycResponse] = useState<unknown>()
  const [isKycFinished, setIsKycFinished] = useState(false)

  const {
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
    if (!selectedKycProvider) return []

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

    return kycDetailsMap[selectedKycProvider]
  }, [kycDetails, selectedKycProvider, t])

  const [isVCRequestPending, setIsVCRequestPending] = useState(false)
  const [isVCRequestFailed, setIsVCRequestFailed] = useState(false)

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

  const retryKyc = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const login = useCallback(
    async (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
      if (supportedKycProvider === selectedKycProvider) {
        retryKyc()

        return
      }

      setSelectedKycProvider(supportedKycProvider)
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

      if (!selectedKycProvider)
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
      >(`/integrations/kyc-service/v1/public/verify/${selectedKycProvider}`, {
        body: {
          data: {
            type: 'verify',
            attributes: {
              identity_id: identityIdString,
              provider_data: {
                ...VERIFY_KYC_DATA_MAP[selectedKycProvider],
              },
            },
          },
        },
      })

      if (!data) return

      if (data.type === 'verification_id') {
        await handleVerificationChecking(data.id)
      }
    },
    [authorizedKycResponse, handleVerificationChecking, selectedKycProvider],
  )

  const handleKycProviderComponentLogin = useCallback(
    async (response: unknown) => {
      setIsVCRequestPending(true)
      setIsVCRequestFailed(false)

      setAuthorizedKycResponse(response)

      if (!selectedKycProvider) return

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

            setIsVCRequestFailed(true)

            return
          }
        }

        setIsKycFinished(true)

        await isClaimOfferExists(currentIdentityIdString)

        await getVerifiableCredentials(currentIdentityIdString)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        setIsVCRequestFailed(true)
      }

      setIsVCRequestPending(false)
      return
    },
    [
      createIdentity,
      getVerifiableCredentials,
      identityIdString,
      isClaimOfferExists,
      selectedKycProvider,
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
          selectedKycProvider,

          authorizedKycResponse,
          selectedKycDetails,
          kycError,
          verificationErrorMessages,

          KYC_PROVIDERS_DETAILS_MAP,

          isVCRequestPending,
          isVCRequestFailed,

          isKycFinished,

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
          {selectedKycProvider ===
          SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS ? (
            <KycProviderUnstoppableDomains
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
            />
          ) : selectedKycProvider === SUPPORTED_KYC_PROVIDERS.WORLDCOIN ? (
            <KycProviderWorldCoin
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
            />
          ) : selectedKycProvider === SUPPORTED_KYC_PROVIDERS.CIVIC ? (
            <KycProviderCivic
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
            />
          ) : selectedKycProvider === SUPPORTED_KYC_PROVIDERS.GITCOIN ? (
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
