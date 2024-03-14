import { config } from '@config'
import { FetcherError } from '@distributedlab/fetcher'
import {
  ConflictError,
  HTTP_STATUS_CODES,
  type JsonApiError,
  UnauthorizedError,
} from '@distributedlab/jac'
import { SaveCredentialsRequestParams } from '@rarimo/rarime-connector'
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
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import {
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

const KycProviderKleros = lazy(
  () => import('@/contexts/KycContext/components/KycProviderKleros'),
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
  [SUPPORTED_KYC_PROVIDERS.KLEROS]: {
    name: 'Kleros',
    iconName: ICON_NAMES.providerKleros,
    link: 'https://app.proofofhumanity.id/',
    isWalletRequired: true,

    completeKycCb: () => {
      window.open('https://app.proofofhumanity.id/', '_blank')
    },
    completeKycMessage: 'Complete your Kleros Passport',
    tooltipElement: (
      <span className='app__kyc-provider-item-tooltip'>
        <b>{`Kleros Passport: `}</b>
        <span>
          {`decentralized arbitration service for the disputes of the new economy.`}
        </span>
      </span>
    ),
  },
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
  detectProviderFromVC: () => void
  handleWorldcoinRedirect: (worldcoinProviderCb: () => void) => Promise<void>

  isUserHasClaimHandled?: (
    VCCreatedOrKycFinishedCb?: () => void,
  ) => Promise<boolean>

  questPlatformDetails?: QuestPlatform
}

export const kycContext = createContext<KycContextValue>({
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
    savedVC,

    createIdentity,
    getClaimOffer,
    saveVC,
  } = useZkpContext()

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

  const detectProviderFromVC = useCallback(async () => {
    try {
      const identityId = identityIdString?.split(':').pop()

      if (!identityId) return

      const { data } = await api.get<{
        provider: string
      }>(`/integrations/kyc-service/v1/public/${identityId}/provider`)

      setSelectedKycProvider(
        {
          civic: SUPPORTED_KYC_PROVIDERS.CIVIC,
          gitcoin_passport: SUPPORTED_KYC_PROVIDERS.GITCOIN,
          unstoppable_domains: SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS,
          worldcoin: SUPPORTED_KYC_PROVIDERS.WORLDCOIN,
          kleros: SUPPORTED_KYC_PROVIDERS.KLEROS,
        }[data.provider],
      )
    } catch (error) {
      if (
        error instanceof FetcherError &&
        error.response.status === HTTP_STATUS_CODES.NOT_FOUND
      ) {
        setSelectedKycProvider(undefined)

        return
      }
    }
  }, [identityIdString])

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

      await detectProviderFromVC()

      await saveVC(currentIdentityIdString, claim)

      setIsVCRequestPending(false)

      return true
    },
    [
      identityIdString,
      createIdentity,
      _getClaimIfExists,
      detectProviderFromVC,
      saveVC,
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
        ErrorHandler.process(error)

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
        [SUPPORTED_KYC_PROVIDERS.KLEROS]: {
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

      const splittedDid = identityIdString.split(':')
      const clearedDid = splittedDid[splittedDid.length - 1]

      const { data } = await api.post<{
        type: 'verification_id'
        id: 'string'
      }>(`/integrations/kyc-service/v1/public/verify/${selectedKycProvider}`, {
        body: {
          data: {
            type: 'verify',
            attributes: {
              identity_id: clearedDid,
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

        /**
         * Keep using CLAIM_TYPE for new claims
         */
        subscribeToClaimWaiting(
          config.CLAIM_TYPE,
          identityIdString,
          async (claimOffer: SaveCredentialsRequestParams) => {
            await saveVC(identityIdString, claimOffer)

            setIsVCRequestPending(false)
          },
        )
      } catch (error) {
        ErrorHandler.process(error)

        setKycError(error as JsonApiError)

        setIsVCRequestFailed(true)

        return
      }
    },
    [
      VCCreatedOrKycFinishedCb,
      saveVC,
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
  }, [searchParams, setQuestPlatformDetails])

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

      {!savedVC && isShowKycProvider && (
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
          ) : selectedKycProvider === SUPPORTED_KYC_PROVIDERS.KLEROS ? (
            <KycProviderKleros
              key={refreshKey}
              loginCb={handleKycProviderComponentLogin}
              errorCb={handleKycComponentError}
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
