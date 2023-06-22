import log from 'loglevel'

import { ErrorHandlerPayload } from '@/types'

import { Bus } from './event-bus'

export class ErrorHandler {
  static process(error: unknown, message = ''): void {
    if (!(error instanceof Error)) return

    Bus.error<ErrorHandlerPayload>({ error, message })

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: Error): void {
    log.error(error)
  }
}
