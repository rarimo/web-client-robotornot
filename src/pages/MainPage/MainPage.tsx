import './styles.scss'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import isEmpty from 'lodash/isEmpty'
import {
  type FC,
  HTMLAttributes,
  lazy,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Icon } from '@/common'
import {
  useKycContext,
  useMetamaskZkpSnapContext,
  useWeb3Context,
  useZkpContext,
} from '@/contexts'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement>

/* prettier-ignore-start */
/* eslint-disable */
const WalletConnectionStep      = lazy(() => import('./components/1_WalletConnection'))
const SnapConnectionStep        = lazy(() => import('./components/2_SnapConnection'))
const IdentityCreationStep      = lazy(() => import('./components/3_IdentityCreation'))
const KycProvidersStep          = lazy(() => import('./components/4_KycProviders'))
const KycProvidersLoaderStep    = lazy(() => import('./components/5_KycProvidersLoader'))
const ProofGeneratingStep       = lazy(() => import('./components/6_ProofGenerating'))
const ProofGeneratingLoaderStep = lazy(() => import('./components/7_ProofGeneratingLoader'))
const ProofSubmittingStep       = lazy(() => import('./components/8_ProofSubmitting'))
const ProofSubmittingLoaderStep = lazy(() => import('./components/9_ProofSubmittingLoader'))
const ProofSubmittedStep        = lazy(() => import('./components/10_ProofSubmitted'))
/* eslint-enable */
/* prettier-ignore-end */

const togglerAnimationVariants: Variants = {
  shown: { overflow: 'hidden', scale: 1 },
  hidden: { overflow: 'hidden', scale: 0 },
}

const sidebarAnimationVariants: Variants = {
  open: {
    width: '33%',
    overflowX: 'hidden',
    marginLeft: '24px',
  },
  collapsed: {
    width: 0,
    overflowX: 'hidden',
    marginLeft: '0',
  },
}

const MainPage: FC<Props> = ({ className, ...rest }) => {
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
  } = useZkpContext()
  const { isVCRequestPending } = useKycContext()

  const CurrentStep = useMemo(() => {
    /* prettier-ignore-start */
    /* eslint-disable */
    if (!provider?.isConnected || !isValidChain)
      return <WalletConnectionStep className='main-page__step' />

    if (!isSnapInstalled)
      return <SnapConnectionStep className='main-page__step' />

    if (!identityIdString)
      return <IdentityCreationStep className='main-page__step' />

    // TODO: group this
    if (isVCRequestPending)
      return <KycProvidersLoaderStep className='main-page__step' />

    if (!verifiableCredentials)
      return <KycProvidersStep className='main-page__step' />

    // TODO: group this
    if (isZKPRequestPending)
      return <ProofGeneratingLoaderStep className='main-page__step' />

    if (!zkProof)
      return <ProofGeneratingStep className='main-page__step' />

    // TODO: group this
    if (isProveRequestPending)
      return <ProofSubmittingLoaderStep className='main-page__step' />

    if (!isUserSubmittedZkp)
      return <ProofSubmittingStep className='main-page__step' />

    return <ProofSubmittedStep className='main-page__step' />
    /* eslint-enable */
    /* prettier-ignore-end */
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

  const ExtraToggler = useCallback(
    (type: 'expand' | 'collapse') => (
      <motion.button
        className='main-page__content-extra-toggler-wrp'
        onClick={() => setIsSidebarOpen(prev => !prev)}
        initial='hidden'
        animate='shown'
        exit='hidden'
        variants={togglerAnimationVariants}
        transition={{ duration: '0.5', ease: 'easeInOut' }}
      >
        <Icon
          className='main-page__content-extra-toggler-icon'
          name={type === 'expand' ? ICON_NAMES.sidebar : ICON_NAMES.collapse}
        />
      </motion.button>
    ),
    [],
  )

  const ExtraContent = useMemo(
    () => (
      <div className='main-page__extra-content'>{ExtraToggler('collapse')}</div>
    ),
    [ExtraToggler],
  )

  // useEffectOnce(() => {
  //   if (
  //     selectedKycProvider &&
  //     !verifiableCredentials &&
  //     !searchParams.get('id_token')
  //   ) {
  //     removeSelectedKycProvider()
  //   }
  //
  //   if (isUserSubmittedZkp) {
  //     navigate(RoutesPaths.authSuccess)
  //   } else if (verifiableCredentials) {
  //     removeZkProof()
  //     navigate(RoutesPaths.authPreview)
  //   } else {
  //     if (
  //       selectedKycProvider === SUPPORTED_KYC_PROVIDERS.WORLDCOIN ||
  //       // FIXME
  //       searchParams.get('id_token')
  //     )
  //       return
  //
  //     navigate(RoutesPaths.authProviders)
  //   }
  // })

  // TODO: add steps indicator
  return (
    <div className={['main-page', className].join(' ')} {...rest}>
      <div className='main-page__content'>
        <AnimatePresence>{CurrentStep}</AnimatePresence>

        <AnimatePresence>
          {!isSidebarOpen && ExtraToggler('expand')}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className='main-page__extra'
            key={`collapse-${sidebarUuid}`}
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={sidebarAnimationVariants}
            transition={{ duration: '0.75', ease: 'backInOut' }}
          >
            {ExtraContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainPage
