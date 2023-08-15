import { UnauthorizedError } from '@distributedlab/jac'

import i18n from '@/localization'

enum KycUnauthorizedErrorCodes {
  InvalidAccessToken = '1',
  InvalidSignature = '2',
  NonceNotFound = '3',
  NotLikelyHuman = '4',
  ScoreTooLow = '5',
  InvalidGatewayToken = '6',
}

export const localizeUnauthorizedError = (error: UnauthorizedError): string => {
  const errorCode = error?.originalError?.response?.data?.errors?.[0]
    ?.code as KycUnauthorizedErrorCodes

  return {
    [KycUnauthorizedErrorCodes.InvalidAccessToken]: i18n.t(
      'kyc-unauthorized-errors.invalid-access-token',
    ),
    [KycUnauthorizedErrorCodes.InvalidSignature]: i18n.t(
      'kyc-unauthorized-errors.invalid-signature',
    ),
    [KycUnauthorizedErrorCodes.NonceNotFound]: i18n.t(
      'kyc-unauthorized-errors.nonce-not-found',
    ),
    [KycUnauthorizedErrorCodes.NotLikelyHuman]: i18n.t(
      'kyc-unauthorized-errors.not-likely-human',
    ),
    [KycUnauthorizedErrorCodes.ScoreTooLow]: i18n.t(
      'kyc-unauthorized-errors.score-too-low',
    ),
    [KycUnauthorizedErrorCodes.InvalidGatewayToken]: i18n.t(
      'kyc-unauthorized-errors.invalid-gateway-token',
    ),
  }[errorCode]
}
