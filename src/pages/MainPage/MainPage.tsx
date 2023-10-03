import './styles.scss'

import { AnimatePresence, motion } from 'framer-motion'
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

const MainPage: FC<Props> = ({ className, ...rest }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { provider } = useWeb3Context()
  const { isSnapInstalled } = useMetamaskZkpSnapContext()
  const {
    identityIdString,
    verifiableCredentials,
    zkProof,

    isZKPRequestPending,
    isProveRequestPending,
    isUserSubmittedZkp,
  } = useZkpContext()
  const { isVCRequestPending } = useKycContext()

  const CurrentStep = useMemo(() => {
    if (!provider?.isConnected) return <WalletConnectionStep />

    if (!isSnapInstalled) return <SnapConnectionStep />

    if (!identityIdString) return <IdentityCreationStep />

    if (isVCRequestPending) return <KycProvidersLoaderStep />

    if (!verifiableCredentials) return <KycProvidersStep />

    if (isZKPRequestPending) return <ProofGeneratingLoaderStep />

    if (!zkProof) return <ProofGeneratingStep />

    if (isProveRequestPending) return <ProofSubmittingLoaderStep />

    if (!isUserSubmittedZkp.get) return <ProofSubmittingStep />

    return <ProofSubmittedStep />
  }, [
    identityIdString,
    isProveRequestPending,
    isSnapInstalled,
    isUserSubmittedZkp,
    isVCRequestPending,
    isZKPRequestPending,
    provider?.isConnected,
    verifiableCredentials,
    zkProof,
  ])

  const sidebarUuid = useMemo(() => uuidv4(), [])
  // TODO: add big initialization method,
  //  which is checks connected wallet status

  const ExtraToggler = useCallback(
    (type: 'expand' | 'collapse') => (
      <motion.button
        className='main-page__content-extra-toggler-wrp'
        onClick={() => setIsSidebarOpen(prev => !prev)}
        initial='hidden'
        animate='shown'
        exit='hidden'
        variants={{
          shown: { overflow: 'hidden', scale: 1 },
          hidden: { overflow: 'hidden', scale: 0 },
        }}
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
            variants={{
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
            }}
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
