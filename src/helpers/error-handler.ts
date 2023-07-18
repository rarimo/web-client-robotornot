import { RuntimeError } from '@distributedlab/tools'
import { errors } from '@distributedlab/w3p'
import log from 'loglevel'

import { bus, BUS_EVENTS } from '@/helpers'
import i18n from '@/localization'

enum VERIFIER_INTERNAL_ERRORS {
  conflictAddressesIdentity = `current address has already been used to verify another identity`,
  conflictIdentityId = 'identity with this identifier has already been verified',
  emptyState = `state doesn't exist in state contract`,
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
        case errors.ProviderUserRejectedRequest:
          errorMessage = ''
          break
        default: {
          if ('error' in error) {
            const currentError = error.error as RuntimeError
            const errorString = currentError?.message?.split(': ')[2]

            switch (currentError?.constructor) {
              case errors.ProviderInternalError:
                if (
                  errorString ===
                  VERIFIER_INTERNAL_ERRORS.conflictAddressesIdentity
                ) {
                  errorMessage = i18n.t(
                    'verifier-errors.conflict-addresses-identity',
                  )
                  msgType = 'warning'
                } else if (
                  errorString === VERIFIER_INTERNAL_ERRORS.emptyState
                ) {
                  errorMessage = i18n.t('verifier-errors.empty-state')
                  msgType = 'warning'
                } else if (
                  errorString === VERIFIER_INTERNAL_ERRORS.conflictIdentityId
                ) {
                  errorMessage = i18n.t('verifier-errors.conflict-identity-id')
                  msgType = 'warning'
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
