import './styles.scss'

import { AnimatePresence, LayoutGroup, motion, Variants } from 'framer-motion'
import {
  type FC,
  HTMLAttributes,
  lazy,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useEffectOnce } from 'react-use'
import { v4 as uuidv4 } from 'uuid'

import { ErrorMessage, Icon, Loader } from '@/common'
import {
  useKycContext,
  useMetamaskZkpSnapContext,
  useWeb3Context,
  useZkpContext,
} from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler, sleep } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

/* prettier-ignore-start */
/* eslint-disable */
const WalletConnectionStep           = lazy(() => import('./components/1_WalletConnection'))
const WalletConnectionSidebarContent = lazy(() => import('./components/1_WalletConnection/components/SidebarContent'))

const SnapConnectionStep             = lazy(() => import('./components/2_SnapConnection'))
const SnapConnectionSidebarContent = lazy(() => import('./components/2_SnapConnection/components/SidebarContent'))

const IdentityCreationStep           = lazy(() => import('./components/3_IdentityCreation'))
const IdentityCreationSidebarContent = lazy(() => import('./components/3_IdentityCreation/components/SidebarContent'))

const KycProvidersStep               = lazy(() => import('./components/4_KycProviders'))
const KycProvidersSidebarContent = lazy(() => import('./components/4_KycProviders/components/SidebarContent'))

const KycProvidersLoaderStep         = lazy(() => import('./components/5_KycProvidersLoader'))
const KycProvidersLoaderSidebarContent = lazy(() => import('./components/5_KycProvidersLoader/components/SidebarContent'))

const ProofGeneratingStep            = lazy(() => import('./components/6_ProofGenerating'))
const ProofGeneratingSidebarContent = lazy(() => import('./components/6_ProofGenerating/components/SidebarContent'))

const ProofGeneratingLoaderStep      = lazy(() => import('./components/7_ProofGeneratingLoader'))
const ProofGeneratingLoaderSidebarContent = lazy(() => import('./components/7_ProofGeneratingLoader/components/SidebarContent'))

const ProofSubmittingStep            = lazy(() => import('./components/8_ProofSubmitting'))
const ProofSubmittingSidebarContent = lazy(() => import('./components/8_ProofSubmitting/components/SidebarContent'))

const ProofSubmittingLoaderStep      = lazy(() => import('./components/9_ProofSubmittingLoader'))
const ProofSubmittingLoaderSidebarContent = lazy(() => import('./components/9_ProofSubmittingLoader/components/SidebarContent'))

const ProofSubmittedStep             = lazy(() => import('./components/10_ProofSubmitted'))
const ProofSubmittedSidebarContent = lazy(() => import('./components/10_ProofSubmitted/components/SidebarContent'))

enum Steps {
  WalletConnectionStep      = 'WALLET_CONNECTION_STEP',
  SnapConnectionStep        = 'SNAP_CONNECTION_STEP',
  IdentityCreationStep      = 'IDENTITY_CREATION_STEP',
  KycProvidersStep          = 'KYC_PROVIDERS_STEP',
  KycProvidersLoaderStep    = 'KYC_PROVIDERS_LOADER_STEP',
  ProofGeneratingStep       = 'PROOF_GENERATING_STEP',
  ProofGeneratingLoaderStep = 'PROOF_GENERATING_LOADER_STEP',
  ProofSubmittingStep       = 'PROOF_SUBMITTING_STEP',
  ProofSubmittingLoaderStep = 'PROOF_SUBMITTING_LOADER_STEP',
  ProofSubmittedStep        = 'PROOF_SUBMITTED_STEP',
}
/* eslint-enable */
/* prettier-ignore-end */

const togglerAnimationVariants: Variants = {
  shown: { overflow: 'hidden', scale: 1 },
  hidden: { overflow: 'hidden', scale: 0 },
}

const mainContentAnimationVariants: Variants = {
  open: {
    width: '100%',
    overflowX: 'hidden',
  },
  collapsed: {
    width: '66.6%',
    overflowX: 'hidden',
  },
}

const sidebarAnimationVariants: Variants = {
  open: {
    width: '33.3%',
    overflowX: 'hidden',
    marginLeft: '24px',
  },
  collapsed: {
    width: 0,
    overflowX: 'hidden',
    marginLeft: '0',
  },
}

const stepAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    x: '-10%',
  },
  shown: {
    opacity: 1,
    x: '0',
  },
}

const stepAnimationProps = {
  variants: stepAnimationVariants,
  initial: 'hidden',
  animate: 'shown',
  exit: 'hidden',
  transition: {
    duration: '0.5',
    ease: 'backInOut',
  },
}

const MainPage: FC<Props> = ({ className, ...rest }) => {
  const [currentStep, setCurrentStep] = useState<Steps>()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const { provider, isValidChain } = useWeb3Context()
  const { isSnapInstalled } = useMetamaskZkpSnapContext()
  const {
    identityIdString,
    verifiableCredentials,
    isZKPRequestPending,
    isProveRequestPending,
    isUserSubmittedZkp,
    zkProof,

    createIdentity,
  } = useZkpContext()
  const { isVCRequestPending } = useKycContext()

  const detectStartStep = useCallback(() => {
    if (!provider?.isConnected || !isValidChain)
      return Steps.WalletConnectionStep

    if (!isSnapInstalled) return Steps.SnapConnectionStep

    if (!identityIdString) return Steps.IdentityCreationStep

    if (isVCRequestPending) return Steps.KycProvidersLoaderStep

    if (!verifiableCredentials) return Steps.KycProvidersStep

    if (isZKPRequestPending) return Steps.ProofGeneratingLoaderStep

    if (!zkProof) return Steps.ProofGeneratingStep

    if (isProveRequestPending) return Steps.ProofSubmittingLoaderStep

    if (!isUserSubmittedZkp) return Steps.ProofSubmittingStep

    return Steps.ProofSubmittedStep
  }, [
    identityIdString,
    isProveRequestPending,
    isSnapInstalled,
    isUserSubmittedZkp,
    isVCRequestPending,
    isValidChain,
    isZKPRequestPending,
    provider?.isConnected,
    verifiableCredentials,
    zkProof,
  ])

  const sidebarUuid = useMemo(() => uuidv4(), [])
  const mainContentUuid = useMemo(() => uuidv4(), [])

  const init = useCallback(async () => {
    try {
      if (verifiableCredentials && isSnapInstalled) {
        /**
         * As createIdentity() method is return existing identity or create new,
         * we can detect created one by checking verifiable credentials
         */
        await createIdentity()
      }

      await sleep(1_000)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      setIsLoadFailed(true)
    }

    setIsLoaded(true)
  }, [createIdentity, isSnapInstalled, verifiableCredentials])

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
    setCurrentStep(Steps.KycProvidersLoaderStep)
  }, [])

  const handleKycProvidersStepError = useCallback((error: Error) => {
    ErrorHandler.processWithoutFeedback(error)

    setCurrentStep(Steps.KycProvidersStep)
  }, [])

  const handleKycProvidersLoaderStepFinish = useCallback(() => {
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
          onErrorCb={handleKycProvidersStepError}
          {...stepAnimationProps}
        />
      ),
      [Steps.KycProvidersLoaderStep]: (
        <KycProvidersLoaderStep
          key={Steps.KycProvidersLoaderStep}
          className='main-page__step'
          nextStepCb={handleKycProvidersLoaderStepFinish}
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
    handleKycProvidersLoaderStepFinish,
    handleKycProvidersStepError,
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
        <WalletConnectionSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.SnapConnectionStep]: (
        <SnapConnectionSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.IdentityCreationStep]: (
        <IdentityCreationSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.KycProvidersStep]: (
        <KycProvidersSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.KycProvidersLoaderStep]: (
        <KycProvidersLoaderSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.ProofGeneratingStep]: (
        <ProofGeneratingSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.ProofGeneratingLoaderStep]: (
        <ProofGeneratingLoaderSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.ProofSubmittingStep]: (
        <ProofSubmittingSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.ProofSubmittingLoaderStep]: (
        <ProofSubmittingLoaderSidebarContent className='main-page__sidebar-content' />
      ),
      [Steps.ProofSubmittedStep]: (
        <ProofSubmittedSidebarContent className='main-page__sidebar-content' />
      ),
    }
  }, [])

  const SidebarToggler = useCallback(
    (type: 'expand' | 'collapse') => (
      <motion.button
        className='main-page__content-sidebar-toggler-wrp'
        onClick={() => setIsSidebarOpen(prev => !prev)}
        initial='hidden'
        animate='shown'
        exit='hidden'
        variants={togglerAnimationVariants}
        transition={{ duration: '0.5' }}
      >
        <Icon
          className='main-page__content-sidebar-toggler-icon'
          name={type === 'expand' ? ICON_NAMES.sidebar : ICON_NAMES.collapse}
        />
      </motion.button>
    ),
    [],
  )

  const SidebarContent = useMemo(
    () => (
      <div className='main-page__sidebar-content'>
        {currentStep && STEPS_SIDEBAR_CONTENT[currentStep]}
        {SidebarToggler('collapse')}
      </div>
    ),
    [STEPS_SIDEBAR_CONTENT, SidebarToggler, currentStep],
  )

  useEffectOnce(() => {
    init()
  })

  useEffect(() => {
    if (!isLoaded || isInitialized) return

    setCurrentStep(detectStartStep())

    setIsInitialized(true)
  }, [detectStartStep, isInitialized, isLoaded])

  // TODO: add steps indicator
  return (
    <div className={['main-page', className].join(' ')} {...rest}>
      {isLoaded ? (
        isLoadFailed ? (
          <ErrorMessage message={`Ooops... something went wrong`} />
        ) : (
          <LayoutGroup>
            <motion.div
              className='main-page__content'
              key={mainContentUuid}
              variants={mainContentAnimationVariants}
              initial='open'
              animate='collapsed'
              exit='open'
              transition={{
                duration: '0.75',
                ease: 'backInOut',
              }}
            >
              <AnimatePresence mode='wait' initial={false}>
                {currentStep && STEPS_COMPONENTS[currentStep]}
              </AnimatePresence>

              <AnimatePresence>
                {!isSidebarOpen && SidebarToggler('expand')}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  className='main-page__sidebar'
                  key={sidebarUuid}
                  variants={sidebarAnimationVariants}
                  initial='collapsed'
                  animate='open'
                  exit='collapsed'
                  transition={{
                    duration: '0.75',
                    delay: 0.5,
                    ease: 'backInOut',
                  }}
                >
                  {SidebarContent}
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        )
      ) : (
        <div className='main-page__loader-wrp main-page__content'>
          <Loader className='main-page__loader' />
        </div>
      )}
    </div>
  )
}

export default MainPage
