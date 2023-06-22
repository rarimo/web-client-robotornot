import log from 'loglevel'
import mitt, { Handler } from 'mitt'

export const BUS_EVENT_TYPES = {
  warning: 'warning',
  success: 'success',
  error: 'error',
  info: 'info',
  reloadVotes: 'reloadVotes',
}

export type EventBusEventName =
  typeof BUS_EVENT_TYPES[keyof typeof BUS_EVENT_TYPES]

interface EventBusEvent<T = unknown> {
  name: EventBusEventName
  payload?: T
}

type EventHandler<T> = (payload: T) => void

const emitter = mitt()

class EventBus {
  _backlog: EventBusEvent[]

  constructor() {
    this._backlog = []
  }

  get eventList(): typeof BUS_EVENT_TYPES {
    return BUS_EVENT_TYPES
  }

  isEventExists(eventName: EventBusEventName): boolean {
    return Object.values(this.eventList).includes(eventName)
  }

  on<T>(eventName: EventBusEventName, handlerFn: EventHandler<T>): void {
    if (!this.isEventExists(eventName)) {
      throw new Error(`EventBus.list has no ${eventName} event`)
    }
    const backloggedEvents = this._backlog.filter(e => e.name === eventName)
    for (const [index, event] of backloggedEvents.entries()) {
      handlerFn(event.payload as T)
      this._backlog.splice(index, 1)
      log.debug(`Event ${eventName} is backlogged. Handling...`)
    }
    emitter.on(eventName, handlerFn as Handler)
  }

  emit<T>(eventName: EventBusEventName, payload?: T): void {
    if (!this.isEventExists(eventName)) {
      throw new Error(`EventBus.list has no ${eventName} event`)
    }

    emitter.emit(eventName, payload)
  }

  resetEvent<T>(
    eventName: EventBusEventName,
    handlerFn: EventHandler<T>,
  ): void {
    if (!this.isEventExists(eventName)) {
      throw new Error(`EventBus.list has no ${eventName} event`)
    }
    emitter.off(eventName, handlerFn as Handler)
    this._backlog = []
  }

  success<T>(payload: T): void {
    this.emit<T>(this.eventList.success, payload)
  }

  warning<T>(payload: T): void {
    this.emit<T>(this.eventList.warning, payload)
  }

  error<T>(payload: T): void {
    this.emit<T>(this.eventList.error, payload)
  }

  info<T>(payload: T): void {
    this.emit<T>(this.eventList.info, payload)
  }
}

export const Bus = new EventBus()
