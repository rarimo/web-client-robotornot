import { config } from '@config'
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
import type { QueryVariableName } from '@/contexts/ZkpContext/ZkpContext'
import { RoutesPaths, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { errors } from '@/errors'
import { abbrCenter, sleep } from '@/helpers'

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
  verificationErrorMessages: string

  isLoaded: boolean

  isValidCredentials: boolean

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
  selectedKycProviderName: undefined,
  authorizedKycResponse: undefined,
  selectedKycDetails: [],
  verificationErrorMessages: '',

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
  const [kycDetails, setKycDetails] = useState<
    Partial<
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
  >()

  const selectedKycDetails = useMemo((): [string, string][] => {
    if (!selectedKycProviderName) return []

    const unstoppablePartialDetails = kycDetails as unknown as UserInfo
    const gitCoinPassportPartialDetails = (kycDetails?.kycAdditionalData &&
    kycDetails?.kycAdditionalData !== 'none'
      ? JSON.parse(kycDetails?.kycAdditionalData as string)
      : {}) as unknown as GitCoinPassportUserInfo
    const civicPartialDetails = kycDetails as unknown as {
      address: string
    }

    const kycDetailsMap: Record<SUPPORTED_KYC_PROVIDERS, [string, string][]> = {
      [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: [
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS}.domain-lbl`,
          ),
          kycDetails?.unstoppableDomain || unstoppablePartialDetails?.sub,
        ],
      ],
      [SUPPORTED_KYC_PROVIDERS.WORDLCOIN]: [],
      [SUPPORTED_KYC_PROVIDERS.CIVIC]: [
        [
          t(
            `kyc-providers-metadata.${SUPPORTED_KYC_PROVIDERS.CIVIC}.address-lbl`,
          ),
          civicPartialDetails?.address
            ? abbrCenter(civicPartialDetails?.address)
            : '',
        ],
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
            metadata.platform.id,
            ['Encrypted', metadata.platform.id].includes(metadata.description)
              ? 'Confirmed'
              : metadata.description,
          ],
        ) ?? []),
      ],
    }

    return kycDetailsMap[selectedKycProviderName]
  }, [kycDetails, selectedKycProviderName, t])

  const [isLoaded, setIsLoaded] = useState(false)

  const [isValidCredentials, setIsValidCredentials] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const [errorMessageCode, setErrorMessageCode] = useState(0)

  const verificationErrorMessages = useMemo(
    () =>
      errorMessageCode
        ? {
            401: t('Complete Your Profile with an Identity Provider'),
            409: t(
              'This KYC provider / Address was already claimed by another identity',
            ),
          }[errorMessageCode] || ''
        : '',
    [errorMessageCode, t],
  )

  const navigate = useNavigate()

  const {
    identity,
    createIdentity,
    isClaimOfferExists,
    getVerifiableCredentials,
  } = useZkpContext()

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

      if (!selectedKycProviderName)
        throw new TypeError('selectedKycProviderName is undefined')

      const VERIFY_KYC_DATA_MAP = {
        [SUPPORTED_KYC_PROVIDERS.WORDLCOIN]: {
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
        `/integrations/kyc-service/v1/public/verify/${selectedKycProviderName}`,
        {
          body: {
            data: {
              type: 'verify',
              attributes: {
                identity_id: identityIdString,
                provider_data: {
                  ...VERIFY_KYC_DATA_MAP[selectedKycProviderName],
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
      selectedKycProviderName,
    ],
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
          if (error instanceof errors.ConflictError && error.httpStatus) {
            setErrorMessageCode(error.httpStatus)
          } else if (
            error instanceof errors.UnauthorizedError &&
            error.httpStatus
          ) {
            setErrorMessageCode(error.httpStatus)
          }

          setIsValidCredentials(false)

          setIsLoaded(true)

          return
        }
      }

      setIsValidCredentials(await isClaimOfferExists(currentIdentity))

      const verifiableCredentials = await getVerifiableCredentials(
        config.DEFAULT_CHAIN,
        currentIdentity,
      )

      setKycDetails((prev: unknown) => ({
        ...(typeof prev === 'object' ? prev : {}),
        ...verifiableCredentials.body.credential.credentialSubject,
      }))

      setIsLoaded(true)

      return
    },
    [
      createIdentity,
      getVerifiableCredentials,
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
          verificationErrorMessages,

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
          setKycDetails={(details: unknown) =>
            setKycDetails(details as unknown as { [k: string]: unknown })
          }
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.WORDLCOIN ? (
        <KycProviderWorldCoin
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
          setKycDetails={(details: unknown) =>
            setKycDetails(details as unknown as { [k: string]: unknown })
          }
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.CIVIC ? (
        <KycProviderCivic
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
          setKycDetails={(details: unknown) =>
            setKycDetails(details as unknown as { [k: string]: unknown })
          }
        />
      ) : selectedKycProviderName === SUPPORTED_KYC_PROVIDERS.GITCOIN ? (
        <KycProviderGitCoin
          key={refreshKey}
          loginCb={handleKycProviderComponentLogin}
          setKycDetails={(details: unknown) =>
            setKycDetails(details as unknown as { [k: string]: unknown })
          }
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default memo(KycContextProvider)
