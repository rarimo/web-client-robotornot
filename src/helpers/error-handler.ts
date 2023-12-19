import { UnauthorizedError } from '@distributedlab/jac'
import { RuntimeError } from '@distributedlab/tools'
import * as Sentry from '@sentry/react'
import log from 'loglevel'

import { errors } from '@/errors'
import { bus, BUS_EVENTS, localizeUnauthorizedError } from '@/helpers'
import i18n from '@/localization'

enum VERIFIER_INTERNAL_ERRORS {
  conflictAddressesIdentity = `Msg sender address has already been used to prove the another identity`,
  conflictIdentityId = 'Identity has already been proven',
  emptyState = `state doesn't exist in state contract`,
  invalidZkpQuery = 'ZKP Query does not exist for passed query id',
  invalidProofSenderAddress = 'Address in proof is not a sender address',
}

export class ErrorHandler {
  static process(error: Error | unknown, errorMessage = ''): void {
    const { msgTranslation, msgType } = ErrorHandler._getErrorMessage(error)
    if (msgTranslation) {
      bus.emit(msgType as BUS_EVENTS, msgTranslation || errorMessage)
    }

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: Error | unknown): void {
    Sentry.captureException(error)
    log.error(error)
  }

  static _getErrorMessage(error: Error | unknown): {
    msgTranslation: string
    msgType: 'error' | 'warning'
  } {
    let errorMessage = ''
    let msgType: 'error' | 'warning' = 'error'

    if (error instanceof Error) {
      switch (error.constructor) {
        case errors.UnauthorizedError: {
          errorMessage = localizeUnauthorizedError(error as UnauthorizedError)
          break
        }
        case errors.ProviderUserRejectedRequest:
          errorMessage = ''
          break
        case errors.ProviderInternalError:
          if (error.message.toLowerCase().includes('timed out')) {
            errorMessage = i18n.t('errors.slow-connection')
            msgType = 'error'
          }
          break
        default: {
          if ('error' in error) {
            const currentError = error.error as RuntimeError
            const errorString = currentError?.message?.split(': ')[2]

            switch (currentError?.constructor) {
              case errors.ProviderInternalError:
                if (
                  errorString?.includes?.(
                    VERIFIER_INTERNAL_ERRORS.conflictAddressesIdentity,
                  )
                ) {
                  errorMessage = i18n.t(
                    'verifier-errors.conflict-addresses-identity',
                  )
                  msgType = 'warning'
                } else if (
                  errorString?.includes?.(VERIFIER_INTERNAL_ERRORS.emptyState)
                ) {
                  errorMessage = i18n.t('verifier-errors.empty-state')
                  msgType = 'warning'
                } else if (
                  errorString?.includes?.(
                    VERIFIER_INTERNAL_ERRORS.conflictIdentityId,
                  )
                ) {
                  errorMessage = i18n.t('verifier-errors.conflict-identity-id')
                  msgType = 'warning'
                } else if (
                  errorString?.includes?.(
                    VERIFIER_INTERNAL_ERRORS.invalidZkpQuery,
                  )
                ) {
                  errorMessage = i18n.t('verifier-errors.invalid-zkp-query')
                } else if (
                  errorString?.includes?.(
                    VERIFIER_INTERNAL_ERRORS.invalidProofSenderAddress,
                  )
                ) {
                  errorMessage = i18n.t(
                    'verifier-errors.invalid-proof-sender-address',
                  )
                }
                break
              default:
                errorMessage = i18n.t('errors.default')
            }
          }
        }
      }
    }

    return {
      msgTranslation: errorMessage,
      msgType: msgType || 'error',
    }
  }
}
