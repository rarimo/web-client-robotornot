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
import { AppButton, Icon } from '@/common'
import { useZkpContext } from '@/contexts'
import type { QueryVariableName } from '@/contexts/ZkpContext/ZkpContext'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import {
  abbrCenter,
  bus,
  BUS_EVENTS,
  ErrorHandler,
  gaSendCustomEvent,
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
    link?: string
    isWalletRequired: boolean

    completeKycCb?: () => void
    completeKycMessage?: string

    tooltipElement: ReactElement | string
  }
> = {
  [SUPPORTED_KYC_PROVIDERS.CIVIC]: {
    name: 'Civic',
    iconName: ICON_NAMES.providerCivic,
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
  getVerificationErrorComponent?: (confirmCb: () => void) => ReactElement

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
  handleWorldcoinRedirect: (worldcoinProviderCb: () => void) => Promise<void>

  isUserHasClaimHandled?: (
    VCCreatedOrKycFinishedCb?: () => void,
  ) => Promise<boolean>

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
  handleWorldcoinRedirect: () => {
    throw new TypeError(`handleWorldcoinRedirect not implemented`)
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

  const [isShowKycProvider, setIsShowKycProvider] = useState(false)

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

    return 'Failed to verify KYC, please contact support'
  }, [kycError, t])

  const getVerificationErrorComponent = useCallback(
    (confirmCb: () => void) => {
      const title =
        kycError?.httpStatus === HTTP_STATUS_CODES.CONFLICT
          ? `This KYC provider / Address was already claimed by another identity`
          : verificationErrorMessages

      const message =
        kycError?.httpStatus === HTTP_STATUS_CODES.CONFLICT
          ? 'Seem like you are trying to use a provider that you used already. Please choose another one'
          : `Unable to Generate Proof of Human Identity. Please Complete Your Profile with an Identity Provider.`

      const actionHandlerText =
        (selectedKycProvider &&
          KYC_PROVIDERS_DETAILS_MAP?.[selectedKycProvider]
            ?.completeKycMessage) ||
        `Return to provider list`

      const actionHandler = () => {
        if (
          selectedKycProvider &&
          KYC_PROVIDERS_DETAILS_MAP?.[selectedKycProvider]?.link
        ) {
          window.open(
            KYC_PROVIDERS_DETAILS_MAP?.[selectedKycProvider]?.link,
            '_blank',
          )
        }

        confirmCb()
      }

      return (
        <div className='kyc-providers__card'>
          <div className='kyc-providers__card-error'>
            <div className='kyc-providers__card-error-icon-wrp'>
              <Icon
                className='kyc-providers__card-error-icon'
                name={ICON_NAMES.x}
              />
            </div>

            <span className='kyc-providers__card-error-title'>{title}</span>
            <span className='kyc-providers__card-error-message'>{message}</span>
          </div>

          <AppButton
            className='kyc-providers__card-button'
            text={actionHandlerText}
            modification='border-circle'
            iconRight={ICON_NAMES.arrowRight}
            onClick={actionHandler}
          />
        </div>
      )
    },
    [kycError?.httpStatus, selectedKycProvider, verificationErrorMessages],
  )

  const retryKyc = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const clearKycError = useCallback(() => {
    setKycError(undefined)
  }, [])

  const _getClaimIfExists = useCallback(
    async (identityIdString: string) => {
      try {
        const claimOffer = await getClaimOffer(identityIdString)

        if (!claimOffer) throw new TypeError('claimOffer is not defined')

        setIsKycFinished(true)

        return claimOffer
      } catch (error) {
        if (
          error instanceof FetcherError &&
          error.response.status === HTTP_STATUS_CODES.NOT_FOUND
        )
          return null

        setKycError(error as JsonApiError)
        setIsVCRequestFailed(true)

        ErrorHandler.processWithoutFeedback(error)

        throw error
      }
    },
    [getClaimOffer],
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
      )}/v1/credentials/${identityIdString}/${claimType}/subscribe`

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

  const detectProviderFromVC = useCallback(
    (VC?: W3CCredential) => {
      const currentVC = VC ?? verifiableCredentials

      if (!currentVC?.credentialSubject?.provider) return

      const provider = currentVC.credentialSubject.provider as string

      setSelectedKycProvider(
        {
          Civic: SUPPORTED_KYC_PROVIDERS.CIVIC,
          GitcoinPassport: SUPPORTED_KYC_PROVIDERS.GITCOIN,
          UnstoppableDomains: SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS,
          Worldcoin: SUPPORTED_KYC_PROVIDERS.WORLDCOIN,
        }[provider],
      )
    },
    [verifiableCredentials],
  )

  const isUserHasClaimHandled = useCallback(
    async (_VCCreatedOrKycFinishedCb?: () => void) => {
      const currentIdentityIdString =
        identityIdString || (await createIdentity())?.identityIdString

      if (!currentIdentityIdString) throw new TypeError('identityId is empty')

      const claim = await _getClaimIfExists(currentIdentityIdString)

      if (!claim) return false

      setIsKycFinished(true)
      setIsVCRequestFailed(false)
      setIsVCRequestPending(true)

      _VCCreatedOrKycFinishedCb?.()

      bus.emit(
        BUS_EVENTS.info,
        "You already have a verifiable credentials, let's check it out!",
      )

      const vc = await getVerifiableCredentials(currentIdentityIdString, claim)

      detectProviderFromVC(vc)

      setIsVCRequestPending(false)

      return true
    },
    [
      _getClaimIfExists,
      createIdentity,
      detectProviderFromVC,
      getVerifiableCredentials,
      identityIdString,
    ],
  )

  const login = useCallback(
    async (
      supportedKycProvider: SUPPORTED_KYC_PROVIDERS,
      _VCCreatedOrKycFinishedCb?: () => void,
    ) => {
      setSelectedKycProvider(supportedKycProvider)

      setVCCreatedOrKycFinishedCb(() => _VCCreatedOrKycFinishedCb)

      try {
        if (await isUserHasClaimHandled(_VCCreatedOrKycFinishedCb)) return

        setIsShowKycProvider(true)

        if (supportedKycProvider === selectedKycProvider) {
          retryKyc()

          return
        }
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)

        setKycError(error as JsonApiError)

        setIsVCRequestFailed(true)
      }
    },
    [isUserHasClaimHandled, retryKyc, selectedKycProvider],
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

  const handleKycComponentError = useCallback((error: Error) => {
    ErrorHandler.processWithoutFeedback(error)

    setKycError(error as JsonApiError)

    setIsVCRequestFailed(true)
  }, [])

  const parseQuestPlatform = useCallback(() => {
    if (questPlatformDetails?.questCreatorDetails?.iconLink) return

    try {
      const questPlatformStr = searchParams.get('quest_platform') as string

      if (!questPlatformStr) return

      const questPlatform = Buffer.from(questPlatformStr, 'base64').toString(
        'binary',
      )

      const parsedQuestPlatform = JSON.parse(questPlatform) as QuestPlatform

      setQuestPlatformDetails(parsedQuestPlatform)

      if (!parsedQuestPlatform) return

      if (
        parsedQuestPlatform?.questCreatorDetails?.name &&
        parsedQuestPlatform?.destinationDetails?.name
      ) {
        gaSendCustomEvent(
          `${parsedQuestPlatform.questCreatorDetails.name}-${parsedQuestPlatform.destinationDetails.name}`,
        )

        return
      }

      gaSendCustomEvent(`User went from quest platform`)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [
    questPlatformDetails?.questCreatorDetails?.iconLink,
    searchParams,
    setQuestPlatformDetails,
  ])

  const handleWorldcoinRedirect = useCallback(
    async (worldcoinProviderCb: () => void) => {
      // FIXME: hotfix due to worldcoin redirect link response
      if (window.location.href.includes('#id_token')) {
        window.open(
          window.location.href.replace('#id_token', '?id_token'),
          '_self',
          'noopener,noreferrer',
        )
      }

      if (searchParams.get('id_token')) {
        login(SUPPORTED_KYC_PROVIDERS.WORLDCOIN, worldcoinProviderCb)
      }
    },
    [login, searchParams],
  )

  useEffectOnce(() => {
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

          getVerificationErrorComponent,

          isUserHasClaimHandled,

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
          handleWorldcoinRedirect,
        }}
      >
        {children}
      </kycContext.Provider>

      <AnimatePresence initial={false} mode='wait'>
        {!verifiableCredentials && isShowKycProvider && (
          <>
            {selectedKycProvider ===
            SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS ? (
              <KycProviderUnstoppableDomains
                key={refreshKey}
                loginCb={handleKycProviderComponentLogin}
                errorCb={handleKycComponentError}
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
                errorCb={handleKycComponentError}
              />
            ) : selectedKycProvider === SUPPORTED_KYC_PROVIDERS.GITCOIN ? (
              <KycProviderGitCoin
                key={refreshKey}
                loginCb={handleKycProviderComponentLogin}
                errorCb={handleKycComponentError}
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
