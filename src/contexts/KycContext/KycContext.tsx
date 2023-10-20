import { config } from '@config'
import { FetcherError } from '@distributedlab/fetcher'
import {
  ConflictError,
  HTTP_STATUS_CODES,
  type JsonApiError,
  UnauthorizedError,
} from '@distributedlab/jac'
import {
  SaveCredentialsRequestParams,
  W3CCredential,
} from '@rarimo/rarime-connector'
import type { UserInfo } from '@uauth/js'
import { AnimatePresence } from 'framer-motion'
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
import { useEffectOnce, useLocalStorage } from 'react-use'

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

type QuestPlatform = {
  questCreatorDetails: {
    name: string
    iconLink: string
  }
  destinationDetails: {
    link: string
    name: string
    iconLink: string
  }
}

interface KycContextValue {
  selectedKycProvider?: SUPPORTED_KYC_PROVIDERS

  selectedKycDetails: [string, string][]
  kycError?: JsonApiError
  verificationErrorMessages: string

  KYC_PROVIDERS_DETAILS_MAP: typeof KYC_PROVIDERS_DETAILS_MAP

  isVCRequestPending: boolean
  isVCRequestFailed: boolean

  isKycFinished: boolean

  login: (
    supportedKycProvider: SUPPORTED_KYC_PROVIDERS,
    VCCreatedOrKycFinishedCb?: () => void,
  ) => Promise<void>
  retryKyc: () => void
  clearKycError: () => void
  setIsVCRequestPending: (isPending: boolean) => void
  setIsVCRequestFailed: (isFailed: boolean) => void
  detectProviderFromVC: (vc?: W3CCredential) => void

  questPlatformDetails?: QuestPlatform
}

export const kycContext = createContext<KycContextValue>({
  selectedKycDetails: [],
  verificationErrorMessages: '',

  KYC_PROVIDERS_DETAILS_MAP,

  isVCRequestPending: false,
  isVCRequestFailed: false,

  isKycFinished: false,

  login: (supportedKycProvider: SUPPORTED_KYC_PROVIDERS) => {
    throw new TypeError(`login not implemented for ${supportedKycProvider}`)
  },
  retryKyc: () => {
    throw new TypeError(`retryKyc not implemented`)
  },
  clearKycError: () => {
    throw new TypeError(`clearKycError not implemented`)
  },
  setIsVCRequestPending: () => {
    throw new TypeError(`setIsVCRequestPending not implemented`)
  },
  setIsVCRequestFailed: () => {
    throw new TypeError(`setIsVCRequestFailed not implemented`)
  },
  detectProviderFromVC: () => {
    throw new TypeError(`detectProviderFromVC not implemented`)
  },

  questPlatformDetails: {} as QuestPlatform,
})

const KycContextProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  const [questPlatformDetails, setQuestPlatformDetails] =
    useLocalStorage<QuestPlatform>('questPlatform', undefined)

  const [selectedKycProvider, setSelectedKycProvider] =
    useState<SUPPORTED_KYC_PROVIDERS>()

  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [isKycFinished, setIsKycFinished] = useState(false)

  const {
    identityIdString,
    verifiableCredentials,

    createIdentity,
    getClaimOffer,
    getVerifiableCredentials,
  } = useZkpContext()

  const kycDetails = useMemo<Partial<
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
  > | null>(
    () => verifiableCredentials?.credentialSubject || null,
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

  const [VCCreatedOrKycFinishedCb, setVCCreatedOrKycFinishedCb] =
    useState<() => void>()

  const verificationErrorMessages = useMemo(() => {
    if (!kycError) return ''

    if (kycError instanceof UnauthorizedError)
      return localizeUnauthorizedError(kycError)

    if (kycError instanceof ConflictError)
      return t(
        `This KYC provider / Address was already claimed by another identity`,
      )

    return ''
  }, [kycError, t])

  const retryKyc = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const clearKycError = useCallback(() => {
    setKycError(undefined)
  }, [])

  const _isUserHasClaim = useCallback(
    async (identityIdString: string) => {
      try {
        const claimOffer = await getClaimOffer(identityIdString)

        setIsKycFinished(true)

        await getVerifiableCredentials(identityIdString, claimOffer)

        return true
      } catch (error) {
        if (
          error instanceof FetcherError &&
          error.response.status === HTTP_STATUS_CODES.NOT_FOUND
        )
          return false

        setKycError(error as JsonApiError)
        setIsVCRequestFailed(true)

        ErrorHandler.processWithoutFeedback(error)

        throw error
      }
    },
    [getClaimOffer, getVerifiableCredentials],
  )

  const subscribeToClaimWaiting = useCallback(
    async (
      claimType: string,
      identityIdString: string,
      onClaimReceived?: (claim: SaveCredentialsRequestParams) => Promise<void>,
    ) => {
      const socketEndpoint = `${String(config.ISSUER_API_URL).replace(
        'http',
        'ws',
      )}/v1/credentials/did:iden3:${identityIdString}/${claimType}/subscribe`

      const socket = new WebSocket(socketEndpoint)

      let isManualClosed = false

      socket.addEventListener('message', async event => {
        const msg = event.data as string | SaveCredentialsRequestParams

        if (msg && msg === 'processing') return false

        isManualClosed = true
        socket.close()

        await onClaimReceived?.(typeof msg === 'string' ? JSON.parse(msg) : msg)
      })

      socket.addEventListener('close', async () => {
        if (!isManualClosed) {
          subscribeToClaimWaiting(claimType, identityIdString, onClaimReceived)
        }
      })
    },
    [],
  )

  const login = useCallback(
    async (
      supportedKycProvider: SUPPORTED_KYC_PROVIDERS,
      _VCCreatedOrKycFinishedCb?: () => void,
    ) => {
      // subscribeToClaimWaiting(config.CLAIM_TYPE, identityIdString)

      setVCCreatedOrKycFinishedCb(() => _VCCreatedOrKycFinishedCb)

      const currentIdentityIdString =
        identityIdString || (await createIdentity())

      if (!currentIdentityIdString) return

      if (await _isUserHasClaim(currentIdentityIdString)) {
        setIsKycFinished(true)
        setIsVCRequestFailed(false)
        setIsVCRequestPending(false)

        _VCCreatedOrKycFinishedCb?.()

        return
      }

      if (supportedKycProvider === selectedKycProvider) {
        retryKyc()

        return
      }

      setSelectedKycProvider(supportedKycProvider)
    },
    [
      _isUserHasClaim,
      createIdentity,
      identityIdString,
      retryKyc,
      selectedKycProvider,
    ],
  )

  const verifyKyc = useCallback(
    async (identityIdString: string, authKycResponse: unknown) => {
      if (!selectedKycProvider)
        throw new TypeError('selectedKycProviderName is not defined')

      const VERIFY_KYC_DATA_MAP = {
        [SUPPORTED_KYC_PROVIDERS.WORLDCOIN]: {
          id_token: authKycResponse,
        },
        [SUPPORTED_KYC_PROVIDERS.CIVIC]: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          chain_name: authKycResponse.chainName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          address: authKycResponse.address,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          signature: authKycResponse.signature,
        },
        [SUPPORTED_KYC_PROVIDERS.GITCOIN]: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          address: authKycResponse.address,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          signature: authKycResponse.signature,
        },
        [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
          access_token: (authKycResponse as { accessToken: string })
            .accessToken,
        },
      }

      const { data } = await api.post<{
        type: 'verification_id'
        id: 'string'
      }>(`/integrations/kyc-service/v1/public/verify/${selectedKycProvider}`, {
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

      if (!data) throw new TypeError('data is not defined')

      return data.id
    },
    [selectedKycProvider],
  )

  const handleKycProviderComponentLogin = useCallback(
    async (response: unknown) => {
      setKycError(undefined)
      setIsVCRequestPending(true)
      setIsVCRequestFailed(false)

      VCCreatedOrKycFinishedCb?.()

      try {
        await verifyKyc(identityIdString, response)

        setIsKycFinished(true)

        await sleep(1000)

        subscribeToClaimWaiting(
          config.CLAIM_TYPE,
          identityIdString,
          async (claimOffer: SaveCredentialsRequestParams) => {
            await getVerifiableCredentials(identityIdString, claimOffer)

            setIsVCRequestPending(false)
          },
        )
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)

        setKycError(error as JsonApiError)

        setIsVCRequestFailed(true)

        return
      }
    },
    [
      VCCreatedOrKycFinishedCb,
      getVerifiableCredentials,
      identityIdString,
      subscribeToClaimWaiting,
      verifyKyc,
    ],
  )

  const detectProviderFromVC = useCallback(
    (VC?: W3CCredential) => {
      const currentVC = VC ?? verifiableCredentials

      if (!currentVC?.credentialSubject?.provider) return

      const provider = currentVC.credentialSubject.provider as string

      setSelectedKycProvider(
        {
          Civic: SUPPORTED_KYC_PROVIDERS.CIVIC,
          'Gitcoin Passport': SUPPORTED_KYC_PROVIDERS.GITCOIN,
          'Unstoppable Domains': SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS,
          Worldcoin: SUPPORTED_KYC_PROVIDERS.WORLDCOIN,
        }[provider],
      )
    },
    [verifiableCredentials],
  )

  const parseQuestPlatform = useCallback(() => {
    if (questPlatformDetails?.questCreatorDetails?.iconLink) return

    try {
      const questPlatformStr = searchParams.get('quest_platform') as string

      const questPlatform = Buffer.from(questPlatformStr, 'base64').toString(
        'binary',
      )

      setQuestPlatformDetails(JSON.parse(questPlatform))
    } catch (error) {
      /* empty */
    }
  }, [
    questPlatformDetails?.questCreatorDetails?.iconLink,
    searchParams,
    setQuestPlatformDetails,
  ])

  // TODO: check worldcoin
  useEffectOnce(() => {
    // FIXME: hotfix due to worldcoin redirect link respond
    if (window.location.href.includes('#id_token')) {
      window.open(
        window.location.href.replace('#id_token', '?id_token'),
        '_self',
        'noopener,noreferrer',
      )
    }

    if (searchParams.get('id_token')) {
      login(SUPPORTED_KYC_PROVIDERS.WORLDCOIN)
    }

    detectProviderFromVC()

    parseQuestPlatform()
  })

  return (
    <>
      <kycContext.Provider
        {...rest}
        value={{
          selectedKycProvider,
          questPlatformDetails,

          selectedKycDetails,
          kycError,
          verificationErrorMessages,

          KYC_PROVIDERS_DETAILS_MAP,

          isVCRequestPending,
          isVCRequestFailed,

          isKycFinished,

          login,
          retryKyc,
          clearKycError,
          setIsVCRequestPending,
          setIsVCRequestFailed,
          detectProviderFromVC,
        }}
      >
        {children}
      </kycContext.Provider>

      <AnimatePresence initial={false} mode='wait'>
        {!verifiableCredentials && (
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
      </AnimatePresence>
    </>
  )
}

export default memo(KycContextProvider)
