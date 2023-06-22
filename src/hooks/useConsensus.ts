import { isEqual } from 'lodash-es'
import log from 'loglevel'
import { useCallback, useEffect, useRef, useState } from 'react'

import { CONFIG } from '@/config'
import { hexToBech32 } from '@/helpers'

enum TENDERMINT_EVENT {
  ROUND_STATE = 'tendermint/event/RoundState',
  NewRound = 'tendermint/event/NewRound',
}

type NewStepResult = {
  result: {
    query: "tm.event='NewRoundStep'"
    data: {
      type: TENDERMINT_EVENT.ROUND_STATE
      value: {
        height: string
        round: number // 0;
        step: 'RoundStepPropose'
      }
    }
    events: {
      'tm.event': ['NewRoundStep']
    }
  }
}

type NewRoundResult = {
  result: {
    query: "tm.event='NewRound'"
    data: {
      type: TENDERMINT_EVENT.NewRound
      value: {
        height: string
        round: number
        step: 'RoundStepNewRound'
        proposer: {
          address: string
          index: number
        }
      }
    }
    events: {
      'tm.event': ['NewRound']
    }
  }
}

const CHAIN_PREFIX_CONSENSUS = `${CONFIG.CHAIN_ID}valcons`

const stepReference = {
  0: 0,
  RoundStepNewHeight: 1,
  RoundStepPropose: 2,
  RoundStepPrevote: 3,
  RoundStepPrecommit: 4,
  RoundStepCommit: 5,
}

/* It's the number of milliseconds to wait before sending the subscription again. */
const KEEP_ALIVE = 30 * 1000

let client: WebSocket | null

/* It's a JSON-RPC request to subscribe to the NewRound event. */
const stepHeader = JSON.stringify({
  jsonrpc: '2.0',
  method: 'subscribe',
  id: 0,
  params: {
    query: "tm.event='NewRoundStep'",
  },
})

/* It's a JSON-RPC request to subscribe to the NewRound event. */
const roundHeader = JSON.stringify({
  jsonrpc: '2.0',
  method: 'subscribe',
  id: 0,
  params: {
    query: "tm.event='NewRound'",
  },
})

/* It's a keep alive message. */
const pingHeader = JSON.stringify({
  type: 'ping',
})

/**
 * It returns the same value as the previous render if the value hasn't changed
 * @param {V} value - The value to memoize.
 * @returns The current value of the ref.
 */
const useShallowMemo = <V, K>(value: V, key?: K): V => {
  const ref = useRef(new Map<K | undefined, V>([[key, value]]))

  if (!isEqual(ref.current.get(key), value)) {
    ref.current.set(key, value)
  }
  const val = ref.current.get(key)
  if (!val) throw new TypeError('Value is undefined')
  return val
}

/**
 * If the client is not ready, wait a second and try again. If the client is ready, send the data and
 * if there's an error, wait a second and try again. If there's no error, and there's a keepAlive
 * value, wait the keepAlive value and try again
 * @param {WebSocket} ws - The WebSocket client that we want to subscribe to the data feed.
 * @param {string} data - The data to send to the server.
 * @param {number} [keepAlive] - The number of milliseconds to wait before sending the subscription
 * again.
 */
function subscribe(ws: WebSocket | null, data: string, keepAlive?: number) {
  /* It's checking if the client is still the same client that we created. If it's not, it means
  that the client has been replaced and we don't want to send any more data to this client. */
  if (!ws || ws !== client) {
    return
  }

  if (ws.readyState !== WebSocket.OPEN) {
    setTimeout(() => subscribe(ws, data, keepAlive), 1000)
  } else {
    try {
      ws.send(data)
      if (keepAlive) setTimeout(() => subscribe(ws, data, keepAlive), keepAlive)
    } catch (err) {
      log.error(err)
      setTimeout(() => subscribe(ws, data, keepAlive), 1000)
    }
  }
}

/**
 * It connects to a websocket, subscribes to the events we want, and then calls the appropriate
 * callback function when it receives an event
 * @param formatNewRound - (data: unknown) => void
 * @param formatNewStep - (data: unknown) => void
 * @returns A WebSocket client
 */
function useConnect() {
  const [loadingNewRound, setLoadingNewRound] = useState(true)
  const [newRound, setNewRound] = useState<NewRoundResult | null>(null)
  const [loadingNewStep, setLoadingNewStep] = useState(true)
  const [newStep, setNewStep] = useState<NewStepResult | null>(null)

  const connect = useCallback(() => {
    const ws = new WebSocket(CONFIG.CHAIN_RPC_URL_WS)
    const reconnectTimer = setTimeout(
      () => ws.close(),
      (12 + Math.random() * 4) * 1000,
    )

    ws.onopen = () => {
      clearTimeout(reconnectTimer)
      subscribe(ws, stepHeader)
      subscribe(ws, roundHeader)
      subscribe(ws, pingHeader, KEEP_ALIVE)
    }
    ws.onmessage = e => {
      if (ws !== client) return
      if (ws?.readyState !== WebSocket.OPEN) return
      const data = JSON.parse(e.data as string)
      const event = data?.result?.data?.type ?? ''

      if (event === TENDERMINT_EVENT.NewRound) {
        setNewRound((prevState: unknown | null) =>
          isEqual(prevState, data) ? prevState : data,
        )
        setLoadingNewRound(false)
      } else if (event === TENDERMINT_EVENT.ROUND_STATE) {
        setNewStep((prevState: unknown | null) =>
          isEqual(prevState, data) ? prevState : data,
        )
        setLoadingNewStep(false)
      }
    }
    ws.onclose = () => {
      log.warn('closing socket')
      setTimeout(() => {
        setLoadingNewRound(true)
        setLoadingNewStep(true)
        connect()
      }, 1000)
    }
    ws.onerror = (err: unknown) => {
      log.error('Socket encountered error', err)
    }
    client = ws
  }, [])
  useEffect(() => {
    connect()
  }, [connect])

  return { loadingNewRound, loadingNewStep, newRound, newStep }
}

const TOTAL_STEPS = 5

/* A callback function that is called when the websocket receives a new round event. */
const formatNewRound = (data: NewRoundResult | null) => {
  const result = data?.result ?? null
  const height = result?.data?.value?.height ?? 0
  const proposerHex = result?.data?.value?.proposer?.address ?? ''
  const consensusAddress = hexToBech32(proposerHex, CHAIN_PREFIX_CONSENSUS)
  return { height, proposer: consensusAddress }
}

/* A callback function that is called when the websocket receives a new round event. */
const formatNewStep = (data: NewStepResult | null) => {
  const result = data?.result ?? null
  const round = result?.data?.value?.round ?? 0
  const step = stepReference[result?.data?.value?.step ?? 0]
  const roundCompletion = (step / TOTAL_STEPS) * 100
  return { round, step, roundCompletion }
}

/**
 * It creates a new websocket connection and closes it when the component unmounts
 * @returns The state of the consensus.
 */
export const useConsensus = () => {
  const { loadingNewRound, loadingNewStep, newRound, newStep } = useConnect()
  const stateMemo = useShallowMemo({
    loadingNewRound,
    loadingNewStep,
    ...formatNewRound(newRound),
    ...formatNewStep(newStep),
    totalSteps: TOTAL_STEPS,
  })

  return {
    state: stateMemo,
  }
}
