import ReactGA from 'react-ga4'

import { ErrorHandler } from '@/helpers'

export enum GaCategories {
  PageView = 'page-view',
  WalletConnection = 'wallet-connection',
  ChainSelection = 'chain-selection',
  TransitState = 'transit-state',
  SubmitZkp = 'submit-zkp',
  GenerateProof = 'generate-proof',
  ProviderSelection = 'provider-selection',
  RetryKyc = 'retry-kyc',
  GettingVerifiableCredentials = 'getting-verifiable-credentials',
}

export const gaSendCustomEvent = (name: string, params?: unknown) => {
  try {
    ReactGA.event(name, params)
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
}
