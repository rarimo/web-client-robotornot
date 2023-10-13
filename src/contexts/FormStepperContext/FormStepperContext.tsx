import {
  createContext,
  FC,
  HTMLAttributes,
  lazy,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useEffectOnce } from 'react-use'

import {
  useKycContext,
  useMetamaskZkpSnapContext,
  useWeb3Context,
  useZkpContext,
} from '@/contexts'
import { ErrorHandler, sleep } from '@/helpers'

/* prettier-ignore-start */
/* eslint-disable */
const WalletConnectionStep                     = lazy(() => import('@/pages/MainPage/components/1_WalletConnection'))
const WalletConnectionSidebarContent           = lazy(() => import('@/pages/MainPage/components/1_WalletConnection/components/SidebarContent'))

const SnapConnectionStep                       = lazy(() => import('@/pages/MainPage/components/2_SnapConnection'))
const SnapConnectionSidebarContent             = lazy(() => import('@/pages/MainPage/components/2_SnapConnection/components/SidebarContent'))

const IdentityCreationStep                     = lazy(() => import('@/pages/MainPage/components/3_IdentityCreation'))
const IdentityCreationSidebarContent           = lazy(() => import('@/pages/MainPage/components/3_IdentityCreation/components/SidebarContent'))

const KycProvidersStep                         = lazy(() => import('@/pages/MainPage/components/4_KycProviders'))
const KycProvidersSidebarContent               = lazy(() => import('@/pages/MainPage/components/4_KycProviders/components/SidebarContent'))

const ProofGeneratingStep                      = lazy(() => import('@/pages/MainPage/components/5_ProofGenerating'))
const ProofGeneratingVCLoaderSidebarContent    = lazy(() => import('@/pages/MainPage/components/5_ProofGenerating/components/SidebarContentVCLoading'))
const ProofGeneratingSidebarContent            = lazy(() => import('@/pages/MainPage/components/5_ProofGenerating/components/SidebarContent'))

const ProofGeneratingLoaderStep                = lazy(() => import('@/pages/MainPage/components/6_ProofGeneratingLoader'))
const ProofGeneratingLoaderSidebarContent      = lazy(() => import('@/pages/MainPage/components/6_ProofGeneratingLoader/components/SidebarContent'))

const ProofSubmittingStep                      = lazy(() => import('@/pages/MainPage/components/7_ProofSubmitting'))
const ProofSubmittingSidebarContent            = lazy(() => import('@/pages/MainPage/components/7_ProofSubmitting/components/SidebarContent'))

const ProofSubmittingLoaderStep                = lazy(() => import('@/pages/MainPage/components/8_ProofSubmittingLoader'))
const ProofSubmittingLoaderSidebarContent      = lazy(() => import('@/pages/MainPage/components/8_ProofSubmittingLoader/components/SidebarContent'))

const ProofSubmittedStep                       = lazy(() => import('@/pages/MainPage/components/9_ProofSubmitted'))
const ProofSubmittedSidebarContent             = lazy(() => import('@/pages/MainPage/components/9_ProofSubmitted/components/SidebarContent'))

export enum Steps {
  WalletConnectionStep      = 'WALLET_CONNECTION_STEP',
  SnapConnectionStep        = 'SNAP_CONNECTION_STEP',
  IdentityCreationStep      = 'IDENTITY_CREATION_STEP',
  KycProvidersStep          = 'KYC_PROVIDERS_STEP',
  ProofGeneratingStep       = 'PROOF_GENERATING_STEP',
  ProofGeneratingLoaderStep = 'PROOF_GENERATING_LOADER_STEP',
  ProofSubmittingStep       = 'PROOF_SUBMITTING_STEP',
  ProofSubmittingLoaderStep = 'PROOF_SUBMITTING_LOADER_STEP',
  ProofSubmittedStep        = 'PROOF_SUBMITTED_STEP',
}
/* eslint-enable */
/* prettier-ignore-end */

interface FormStepperContextValue {
  isLoaded: boolean
  isLoadFailed: boolean

  stepsProgress: number

  StepComponent: ReactElement
  SidebarComponent: ReactElement

  handleError: (error: Error) => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: Steps) => void
}

export const formStepperContext = createContext<FormStepperContextValue>({
  isLoaded: false,
  isLoadFailed: false,

  stepsProgress: 0,

  StepComponent: <></>,
  SidebarComponent: <></>,

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

  const { provider, isValidChain } = useWeb3Context()
  const { isSnapInstalled } = useMetamaskZkpSnapContext()
  const {
    identityIdString,
    verifiableCredentials,
    isUserSubmittedZkp,
    zkProof,

    createIdentity,
    getIsIdentityProvedMsg,
    parseDIDToIdentityBigIntString,
  } = useZkpContext()
  const { isVCRequestPending } = useKycContext()

  const stepsProgress = useMemo(() => {
    const steps = Object.values(Steps)

    return (
      ((steps.findIndex(step => step === currentStep) + 1) / steps.length) * 100
    )
  }, [currentStep])

  const detectStartStep = useCallback(() => {
    if (!provider?.isConnected || !isValidChain)
      return Steps.WalletConnectionStep

    if (!isSnapInstalled) return Steps.SnapConnectionStep

    if (!identityIdString) return Steps.IdentityCreationStep

    if (!verifiableCredentials) return Steps.KycProvidersStep

    if (!zkProof) return Steps.ProofGeneratingStep

    if (!isUserSubmittedZkp) return Steps.ProofSubmittingStep

    return Steps.ProofSubmittedStep
  }, [
    identityIdString,
    isSnapInstalled,
    isUserSubmittedZkp,
    isValidChain,
    provider?.isConnected,
    verifiableCredentials,
    zkProof,
  ])

  const init = useCallback(async () => {
    try {
      let identityBigIntString = ''

      if (isSnapInstalled && provider?.isConnected) {
        /**
         * As createIdentity() method is return existing identity or create new,
         * we can detect created one by checking verifiable credentials
         */
        const identityIdString = await createIdentity()

        identityBigIntString = identityIdString
          ? parseDIDToIdentityBigIntString(identityIdString)
          : ''
      }

      if (identityBigIntString) {
        const isIdentityProvedMsg = await getIsIdentityProvedMsg(
          identityBigIntString,
        )

        if (isIdentityProvedMsg) {
          setCurrentStep(Steps.ProofSubmittedStep)
        }
      }

      await sleep(1_000)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      setIsLoadFailed(true)
    }

    setIsLoaded(true)
  }, [
    isSnapInstalled,
    provider?.isConnected,
    createIdentity,
    parseDIDToIdentityBigIntString,
    getIsIdentityProvedMsg,
  ])

  const handleWalletConnectionStepFinish = useCallback(() => {
    setCurrentStep(Steps.SnapConnectionStep)
  }, [])

  const handleSnapConnectionStepFinish = useCallback(() => {
    setCurrentStep(Steps.IdentityCreationStep)
  }, [])

  const handleIdentityCreationStepFinish = useCallback(() => {
    setCurrentStep(Steps.KycProvidersStep)
  }, [])

  const handleKycProvidersStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofGeneratingStep)
  }, [])

  const handleProofGeneratingStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofGeneratingLoaderStep)
  }, [])

  const handleProofGeneratingStepError = useCallback((error: Error) => {
    ErrorHandler.processWithoutFeedback(error)

    setCurrentStep(Steps.ProofGeneratingStep)
  }, [])

  const handleProofGeneratingLoaderStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofSubmittingStep)
  }, [])

  const handleProofSubmittingStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofSubmittingLoaderStep)
  }, [])

  const handleProofSubmittingStepError = useCallback((error: Error) => {
    ErrorHandler.processWithoutFeedback(error)

    setCurrentStep(Steps.ProofSubmittingStep)
  }, [])

  const handleProofSubmittingLoaderStepFinish = useCallback(() => {
    setCurrentStep(Steps.ProofSubmittedStep)
  }, [])

  const handleProofSubmittedStepFinish = useCallback(() => {
    /* empty */
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
          onErrorCb={handleProofGeneratingStepError}
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
      [Steps.ProofSubmittingLoaderStep]: (
        <ProofSubmittingLoaderStep
          key={Steps.ProofSubmittingLoaderStep}
          className='main-page__step'
          nextStepCb={handleProofSubmittingLoaderStepFinish}
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
    handleProofGeneratingStepError,
    handleProofGeneratingLoaderStepFinish,
    handleProofGeneratingStepFinish,
    handleProofSubmittedStepFinish,
    handleProofSubmittingLoaderStepFinish,
    handleProofSubmittingStepError,
    handleProofSubmittingStepFinish,
    handleSnapConnectionStepFinish,
    handleWalletConnectionStepFinish,
  ])

  const STEPS_SIDEBAR_CONTENT: Record<Steps, ReactElement> = useMemo(() => {
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
      [Steps.ProofSubmittingLoaderStep]: (
        <ProofSubmittingLoaderSidebarContent
          key={Steps.ProofSubmittingLoaderStep}
          className='main-page__sidebar-content'
          {...sidebarContentAnimationProps}
        />
      ),
      [Steps.ProofSubmittedStep]: (
        <ProofSubmittedSidebarContent
          key={Steps.ProofSubmittedStep}
          className='main-page__sidebar-content'
          {...sidebarContentAnimationProps}
        />
      ),
    }
  }, [isVCRequestPending])

  const StepComponent: ReactElement = useMemo(() => {
    return currentStep ? STEPS_COMPONENTS[currentStep] : <></>
  }, [STEPS_COMPONENTS, currentStep])

  const SidebarComponent: ReactElement = useMemo(() => {
    return currentStep ? STEPS_SIDEBAR_CONTENT[currentStep] : <></>
  }, [STEPS_SIDEBAR_CONTENT, currentStep])

  const nextStep = useCallback(() => {
    const steps = Object.values(Steps)

    const nextStepIndex = steps.findIndex(step => step === currentStep) + 1

    if (!steps[nextStepIndex]) return

    setCurrentStep(steps[nextStepIndex])
  }, [currentStep])

  const prevStep = useCallback(() => {
    const steps = Object.values(Steps)

    const prevStepIndex = steps.findIndex(step => step === currentStep) - 1

    if (!steps[prevStepIndex]) return

    setCurrentStep(steps[prevStepIndex])
  }, [currentStep])

  const setStep = useCallback((step: Steps) => {
    setCurrentStep(step)
  }, [])

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

    if (!currentStep) setCurrentStep(detectStartStep())

    setIsInitialized(true)
  }, [currentStep, detectStartStep, isInitialized, isLoaded])

  return (
    <formStepperContext.Provider
      value={{
        isLoaded,
        isLoadFailed,

        stepsProgress,

        StepComponent,
        SidebarComponent,

        nextStep,
        prevStep,
        setStep,
        handleError,
      }}
    >
      {children}
    </formStepperContext.Provider>
  )
}

export default memo(FormStepperContextProvider)
