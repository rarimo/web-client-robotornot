import isEmpty from 'lodash/isEmpty'
import {
  createContext,
  FC,
  HTMLAttributes,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { config } from '@/config'
import {
  useKycContext,
  useMetamaskZkpSnapContext,
  useWeb3Context,
  useZkpContext,
} from '@/contexts'
import { ErrorHandler, GaCategories, gaSendCustomEvent } from '@/helpers'
import WalletConnectionStep from '@/pages/MainPage/components/1_WalletConnection'
import WalletConnectionSidebarContent from '@/pages/MainPage/components/1_WalletConnection/components/SidebarContent'
import SnapConnectionStep from '@/pages/MainPage/components/2_SnapConnection'
import SnapConnectionSidebarContent from '@/pages/MainPage/components/2_SnapConnection/components/SidebarContent'
import IdentityCreationStep from '@/pages/MainPage/components/3_IdentityCreation'
import IdentityCreationSidebarContent from '@/pages/MainPage/components/3_IdentityCreation/components/SidebarContent'
import KycProvidersStep from '@/pages/MainPage/components/4_KycProviders'
import KycProvidersSidebarContent from '@/pages/MainPage/components/4_KycProviders/components/SidebarContent'
import ProofGeneratingStep from '@/pages/MainPage/components/5_ProofGenerating'
import ProofGeneratingSidebarContent from '@/pages/MainPage/components/5_ProofGenerating/components/SidebarContent'
import ProofGeneratingVCLoaderSidebarContent from '@/pages/MainPage/components/5_ProofGenerating/components/SidebarContentVCLoading'
import ProofGeneratingLoaderStep from '@/pages/MainPage/components/6_ProofGeneratingLoader'
import ProofGeneratingLoaderSidebarContent from '@/pages/MainPage/components/6_ProofGeneratingLoader/components/SidebarContent'
import ProofSubmittingStep from '@/pages/MainPage/components/7_ProofSubmitting'
import ProofSubmittingSidebarContent from '@/pages/MainPage/components/7_ProofSubmitting/components/SidebarContent'
import ProofSubmittedStep from '@/pages/MainPage/components/8_ProofSubmitted'
// eslint-disable-next-line max-len
// import ProofSubmittedSidebarContent from '@/pages/MainPage/components/8_ProofSubmitted/components/SidebarContent'

export enum Steps {
  WalletConnectionStep = 'WALLET_CONNECTION_STEP',
  SnapConnectionStep = 'SNAP_CONNECTION_STEP',
  IdentityCreationStep = 'IDENTITY_CREATION_STEP',
  KycProvidersStep = 'KYC_PROVIDERS_STEP',
  ProofGeneratingStep = 'PROOF_GENERATING_STEP',
  ProofGeneratingLoaderStep = 'PROOF_GENERATING_LOADER_STEP',
  ProofSubmittingStep = 'PROOF_SUBMITTING_STEP',
  ProofSubmittedStep = 'PROOF_SUBMITTED_STEP',
}

interface FormStepperContextValue {
  isLoaded: boolean
  isLoadFailed: boolean

  stepsProgress: number

  StepComponent: ReactElement
  SidebarComponent?: ReactElement

  isSidebarExist: boolean

  handleError: (error: Error) => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: Steps) => void

  isSidebarAnimationCompleted: boolean
  setIsSidebarAnimationCompleted: (value: boolean) => void

  isSidebarClosingDisabled: boolean
  setIsSidebarClosingDisabled: (value: boolean) => void
}

export const formStepperContext = createContext<FormStepperContextValue>({
  isLoaded: false,
  isLoadFailed: false,

  stepsProgress: 0,

  StepComponent: <></>,
  SidebarComponent: <></>,

  isSidebarExist: true,

  handleError: () => {
    throw new TypeError('handleError method is not defined')
  },
  nextStep: () => {
    throw new TypeError('nextStep method is not defined')
  },
  prevStep: () => {
    throw new TypeError('prevStep method is not defined')
  },
  setStep: () => {
    throw new TypeError('setStep method is not defined')
  },

  isSidebarAnimationCompleted: false,
  setIsSidebarAnimationCompleted: () => {
    throw new TypeError('setIsSidebarAnimationCompleted method is not defined')
  },

  isSidebarClosingDisabled: false,
  setIsSidebarClosingDisabled: () => {
    throw new TypeError('setIsSidebarAnimationCompleted method is not defined')
  },
})

type Props = HTMLAttributes<HTMLDivElement>

const sidebarContentAnimationProps = {
  variants: {
    shown: {
      opacity: 1,
      x: '0',
    },
    hidden: {
      opacity: 0,
      x: '10%',
    },
  },
  initial: 'hidden',
  animate: 'shown',
  exit: 'hidden',
  transition: {
    duration: '0.5',
    ease: 'easeInOut',
  },
}

const stepAnimationProps = {
  variants: {
    hidden: {
      opacity: 0,
      x: '-10%',
    },
    shown: {
      opacity: 1,
      x: '0',
    },
  },
  initial: 'hidden',
  animate: 'shown',
  exit: 'hidden',
  transition: {
    duration: '0.5',
    ease: 'backInOut',
  },
}

const FormStepperContextProvider: FC<Props> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<Steps>()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [isSidebarClosingDisabled, setIsSidebarClosingDisabled] =
    useState(false)

  const { provider, isValidChain } = useWeb3Context()
  const { isSnapInstalled } = useMetamaskZkpSnapContext()
  const {
    identityIdString,
    savedVC,
    isUserSubmittedZkp,
    zkProof,

    createIdentity,
    getIsIdentityProvedMsg,
  } = useZkpContext()
  const { isVCRequestPending, isUserHasClaimHandled, handleWorldcoinRedirect } =
    useKycContext()

  const [isSidebarAnimationCompleted, setIsSidebarAnimationCompleted] =
    useState(false)

  const stepsProgress = useMemo(() => {
    const steps = Object.values(Steps)

    return (
      ((steps.findIndex(step => step === currentStep) + 1) / steps.length) * 100
    )
  }, [currentStep])

  const [searchParams] = useSearchParams()

  const handleIfUserClaimExist = useCallback(async (): Promise<Steps> => {
    let identity

    try {
      identity = await createIdentity()
    } catch (e) {
      identity = undefined
    }

    if (!identity) return Steps.IdentityCreationStep

    const { identityIdBigIntString } = identity

    const isIdentityProvedMsg = await getIsIdentityProvedMsg(
      identityIdBigIntString,
    )

    if (isIdentityProvedMsg) {
      return Steps.ProofSubmittedStep
    }

    try {
      const _isUserHasClaimHandled = await isUserHasClaimHandled?.(() => {
        setCurrentStep(Steps.ProofGeneratingStep)
      })

      if (_isUserHasClaimHandled) return Steps.ProofGeneratingStep
    } catch (error) {
      /* empty */
    }

    return Steps.KycProvidersStep
  }, [createIdentity, getIsIdentityProvedMsg, isUserHasClaimHandled])

  const detectStartStep = useCallback(async () => {
    if (
      searchParams.get('id_token') &&
      provider?.isConnected &&
      isSnapInstalled
    )
      return

    if (!provider?.isConnected || !isValidChain)
      return Steps.WalletConnectionStep

    if (!isSnapInstalled) return Steps.SnapConnectionStep

    if (!identityIdString) return Steps.IdentityCreationStep

    if (!savedVC || isEmpty(savedVC)) return await handleIfUserClaimExist()

    if (!zkProof || isEmpty(zkProof)) return Steps.ProofGeneratingStep

    if (!isUserSubmittedZkp) return Steps.ProofSubmittingStep

    return Steps.ProofSubmittedStep
  }, [
    handleIfUserClaimExist,
    identityIdString,
    isSnapInstalled,
    isUserSubmittedZkp,
    isValidChain,
    provider?.isConnected,
    searchParams,
    savedVC,
    zkProof,
  ])

  const init = useCallback(async () => {
    if (provider?.isConnected && !isValidChain) return

    try {
      let identityBigIntString = ''

      if (isSnapInstalled && provider?.isConnected) {
        /**
         * As createIdentity() method is return existing identity or create new,
         * we can detect created one by checking verifiable credentials
         */
        try {
          const identity = await createIdentity()

          identityBigIntString = identity?.identityIdBigIntString ?? ''
        } catch (error) {
          identityBigIntString = ''
        }
      }

      if (identityBigIntString) {
        const isIdentityProvedMsg = await getIsIdentityProvedMsg(
          identityBigIntString,
        )

        if (isIdentityProvedMsg) {
          ErrorHandler.processWithoutFeedback(isIdentityProvedMsg)
          setCurrentStep(Steps.ProofSubmittedStep)
        }
      }

      await handleWorldcoinRedirect(() => {
        setCurrentStep(Steps.ProofGeneratingStep)
      })
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      setIsLoadFailed(true)
    }

    setIsLoaded(true)
  }, [
    isValidChain,
    isSnapInstalled,
    provider?.isConnected,
    handleWorldcoinRedirect,
    createIdentity,
    getIsIdentityProvedMsg,
  ])

  const setStep = useCallback((step: Steps) => {
    setIsSidebarAnimationCompleted(false)

    setCurrentStep(step)
  }, [])

  const nextStep = useCallback(() => {
    const steps = Object.values(Steps)

    const nextStepIndex = steps.findIndex(step => step === currentStep) + 1

    if (!steps[nextStepIndex]) return

    setStep(steps[nextStepIndex])
  }, [currentStep, setStep])

  const prevStep = useCallback(() => {
    const steps = Object.values(Steps)

    const prevStepIndex = steps.findIndex(step => step === currentStep) - 1

    if (!steps[prevStepIndex]) return

    setStep(steps[prevStepIndex])
  }, [currentStep, setStep])

  const handleWalletConnectionStepFinish = useCallback(() => {
    setCurrentStep(Steps.SnapConnectionStep)
  }, [])

  const handleSnapConnectionStepFinish = useCallback(() => {
    setCurrentStep(Steps.IdentityCreationStep)
  }, [])

  const handleIdentityCreationStepFinish = useCallback(async () => {
    if (!isSnapInstalled || !provider?.isConnected)
      throw new TypeError('snap is not installed or wallet is not connected')

    /**
     * As createIdentity() method is return existing identity or create new,
     * we can detect created one by checking verifiable credentials
     */
    setCurrentStep(await handleIfUserClaimExist())
  }, [handleIfUserClaimExist, isSnapInstalled, provider?.isConnected])

  const handleKycProvidersStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofGeneratingStep)
  }, [])

  const handleProofGeneratingStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofGeneratingLoaderStep)
  }, [])

  const handleProofGeneratingLoaderStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofSubmittingStep)
  }, [])

  const handleProofSubmittingStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofSubmittedStep)
  }, [])

  const handleProofSubmittingStepError = useCallback((error: Error) => {
    ErrorHandler.processWithoutFeedback(error)

    setCurrentStep(Steps.ProofSubmittingStep)
  }, [])

  const handleProofSubmittedStepFinish = useCallback(() => {
    if (!config.DASHBOARD_LINK) return

    window.location.assign(config.DASHBOARD_LINK)
  }, [])

  const STEPS_COMPONENTS: Record<Steps, ReactElement> = useMemo(() => {
    return {
      [Steps.WalletConnectionStep]: (
        <WalletConnectionStep
          key={Steps.WalletConnectionStep}
          className='main-page__step'
          nextStepCb={handleWalletConnectionStepFinish}
          {...stepAnimationProps}
        />
      ),
      [Steps.SnapConnectionStep]: (
        <SnapConnectionStep
          key={Steps.SnapConnectionStep}
          className='main-page__step'
          nextStepCb={handleSnapConnectionStepFinish}
          {...stepAnimationProps}
        />
      ),
      [Steps.IdentityCreationStep]: (
        <IdentityCreationStep
          key={Steps.IdentityCreationStep}
          className='main-page__step'
          nextStepCb={handleIdentityCreationStepFinish}
          {...stepAnimationProps}
        />
      ),
      [Steps.KycProvidersStep]: (
        <KycProvidersStep
          key={Steps.KycProvidersStep}
          className='main-page__step'
          nextStepCb={handleKycProvidersStepFinish}
          {...stepAnimationProps}
        />
      ),
      [Steps.ProofGeneratingStep]: (
        <ProofGeneratingStep
          key={Steps.ProofGeneratingStep}
          className='main-page__step'
          nextStepCb={handleProofGeneratingStepFinish}
          {...stepAnimationProps}
        />
      ),
      [Steps.ProofGeneratingLoaderStep]: (
        <ProofGeneratingLoaderStep
          key={Steps.ProofGeneratingLoaderStep}
          className='main-page__step'
          nextStepCb={handleProofGeneratingLoaderStepFinish}
          {...stepAnimationProps}
        />
      ),
      [Steps.ProofSubmittingStep]: (
        <ProofSubmittingStep
          key={Steps.ProofSubmittingStep}
          className='main-page__step'
          nextStepCb={handleProofSubmittingStepFinish}
          onErrorCb={handleProofSubmittingStepError}
          {...stepAnimationProps}
        />
      ),
      [Steps.ProofSubmittedStep]: (
        <ProofSubmittedStep
          key={Steps.ProofSubmittedStep}
          className='main-page__step'
          nextStepCb={handleProofSubmittedStepFinish}
          {...stepAnimationProps}
        />
      ),
    }
  }, [
    handleIdentityCreationStepFinish,
    handleKycProvidersStepFinish,
    handleProofGeneratingLoaderStepFinish,
    handleProofGeneratingStepFinish,
    handleProofSubmittedStepFinish,
    handleProofSubmittingStepError,
    handleProofSubmittingStepFinish,
    handleSnapConnectionStepFinish,
    handleWalletConnectionStepFinish,
  ])

  const STEPS_SIDEBAR_CONTENT: Record<Steps, ReactElement | undefined> =
    useMemo(() => {
      return {
        [Steps.WalletConnectionStep]: (
          <WalletConnectionSidebarContent
            key={Steps.WalletConnectionStep}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ),
        [Steps.SnapConnectionStep]: (
          <SnapConnectionSidebarContent
            key={Steps.SnapConnectionStep}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ),
        [Steps.IdentityCreationStep]: (
          <IdentityCreationSidebarContent
            key={Steps.IdentityCreationStep}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ),
        [Steps.KycProvidersStep]: (
          <KycProvidersSidebarContent
            key={Steps.KycProvidersStep}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ),
        [Steps.ProofGeneratingStep]: isVCRequestPending ? (
          <ProofGeneratingVCLoaderSidebarContent
            key={`${Steps.KycProvidersStep}-loader`}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ) : (
          <ProofGeneratingSidebarContent
            key={Steps.ProofGeneratingStep}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ),
        [Steps.ProofGeneratingLoaderStep]: (
          <ProofGeneratingLoaderSidebarContent
            key={Steps.ProofGeneratingLoaderStep}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ),
        [Steps.ProofSubmittingStep]: (
          <ProofSubmittingSidebarContent
            key={Steps.ProofSubmittingStep}
            className='main-page__sidebar-content'
            {...sidebarContentAnimationProps}
          />
        ),
        [Steps.ProofSubmittedStep]: undefined,
      }
    }, [isVCRequestPending])

  const StepComponent: ReactElement = useMemo(() => {
    return currentStep ? STEPS_COMPONENTS[currentStep] : <></>
  }, [STEPS_COMPONENTS, currentStep])

  const SidebarComponent: ReactElement | undefined = useMemo(() => {
    return currentStep ? STEPS_SIDEBAR_CONTENT[currentStep] : undefined
  }, [STEPS_SIDEBAR_CONTENT, currentStep])

  const isSidebarExist = useMemo(
    () => currentStep !== Steps.ProofSubmittedStep,
    [currentStep],
  )

  const handleError = useCallback(
    (error: Error) => {
      ErrorHandler.processWithoutFeedback(error)

      prevStep()
    },
    [prevStep],
  )

  useEffectOnce(() => {
    init()
  })

  useEffect(() => {
    if (!isLoaded || isInitialized) return

    let defineStep = async () => {
      if (!currentStep) setCurrentStep(await detectStartStep())

      setIsInitialized(true)
    }

    defineStep()

    return () => {
      defineStep = async () => {
        /* empty */
      }
    }
  }, [currentStep, detectStartStep, isInitialized, isLoaded])

  useEffect(() => {
    gaSendCustomEvent(GaCategories.PageView, { pathname: currentStep })
  }, [currentStep])

  return (
    <formStepperContext.Provider
      value={{
        isLoaded,
        isLoadFailed,

        stepsProgress,

        StepComponent,
        SidebarComponent,

        isSidebarExist,

        nextStep,
        prevStep,
        setStep,
        handleError,

        isSidebarAnimationCompleted,
        setIsSidebarAnimationCompleted,

        isSidebarClosingDisabled,
        setIsSidebarClosingDisabled,
      }}
    >
      {children}
    </formStepperContext.Provider>
  )
}

export default memo(FormStepperContextProvider)
