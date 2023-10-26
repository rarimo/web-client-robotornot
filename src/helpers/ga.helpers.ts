import ReactGA from 'react-ga4'

import { ErrorHandler } from '@/helpers'

export enum GaCategories {
  PageView = 'page-view',
  WalletConnection = 'wallet-connection',
  SubmitZkp = 'submit-zkp',
  GenerateProof = 'generate-proof',
  ProviderSelection = 'provider-selection',
  GettingVerifiableCredentials = 'getting-verifiable-credentials',
}

export const gaSendCustomEvent = (name: string, params?: unknown) => {
  try {
    ReactGA.event(name, params)
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
}
