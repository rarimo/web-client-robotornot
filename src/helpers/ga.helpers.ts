import ReactGA from 'react-ga4'

import { ErrorHandler } from '@/helpers'

export enum GaCategories {
  Page = 'page',
  Click = 'click',
  ProviderSelection = 'provider-selection',
  RetryKyc = 'retry-kyc',
}

export enum GaActions {
  PageView = 'page-view',
  Click = 'click',
  ProviderSelection = 'provider-selection',
}

export const gaSendCustomEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
) => {
  try {
    ReactGA.event({
      category,
      action,
      ...(label ? { label } : {}),
      ...(value ? { value } : {}),
    })
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
}
