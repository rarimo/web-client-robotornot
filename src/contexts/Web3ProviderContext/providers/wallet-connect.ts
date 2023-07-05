import { DEFAULT_CHAIN, SUPPORTED_CHAINS_DETAILS } from '@config'
import {
  Chain,
  CHAIN_TYPES,
  ChainId,
  EthTransactionResponse,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  PROVIDER_EVENT_BUS_EVENTS,
  PROVIDER_EVENTS,
  ProviderEventBus,
  ProviderProxy,
  RawProvider,
  SolanaTransactionResponse,
  TransactionResponse,
} from '@distributedlab/w3p'
import { WalletConnectModal } from '@walletconnect/modal'
import { default as UniversalProvider } from '@walletconnect/universal-provider'
import { providers } from 'ethers'

import { EXTERNAL_PROVIDERS } from '@/contexts/Web3ProviderContext/enums'

const PROJECT_ID = '6daa12d5e4b9741f11ea10bda8ff6ede'

export class WalletConnectEvmProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  #provider: InstanceType<typeof UniversalProvider>

  #ethProvider?: providers.Web3Provider

  #modal = new WalletConnectModal({
    projectId: PROJECT_ID,
    chains: ['eip155:1'],
  })

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()

    this.#provider = provider as unknown as InstanceType<
      typeof UniversalProvider
    >
  }

  static get providerType(): string {
    return EXTERNAL_PROVIDERS.WalletConnect
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.EVM
  }

  get isConnected(): boolean {
    return Boolean(this.#chainId)
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  get #defaultEventPayload() {
    return {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    this.#provider = await UniversalProvider.init({
      projectId: PROJECT_ID,
      logger: 'info',
      relayUrl: 'wss://relay.walletconnect.com',
    })
    this.#ethProvider = new providers.Web3Provider(this.#provider)

    await this.#setListeners()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async connect(): Promise<void> {
    await this.#provider.connect({
      namespaces: {
        eip155: {
          methods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
          ],
          chains: ['eip155:11155111'],
          defaultChain: `eip155:${SUPPORTED_CHAINS_DETAILS[DEFAULT_CHAIN].id}`,
          events: [
            PROVIDER_EVENTS.Connect,
            PROVIDER_EVENTS.Disconnect,
            PROVIDER_EVENTS.ChainChanged,
            PROVIDER_EVENTS.AccountsChanged,
          ],
        },
      },
    })

    this.#chainId =
      this.#provider.session?.namespaces?.eip155?.chains?.[0]?.split(':')[1]

    this.#address =
      this.#provider.session?.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2]

    this.#ethProvider = new providers.Web3Provider(this.#provider)

    this.#modal.closeModal()

    this.emit(
      PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
      this.#defaultEventPayload,
    )
    this.emit(
      this.isConnected
        ? PROVIDER_EVENT_BUS_EVENTS.Connect
        : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
      this.#defaultEventPayload,
    )
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getEthExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getEthExplorerTxUrl(chain, txHash)
  }

  getHashFromTx(txResponse: TransactionResponse): string {
    return (txResponse as EthTransactionResponse)
      .transactionHash as SolanaTransactionResponse
  }

  async #setListeners() {
    this.#provider.on('display_uri', async (uri: string) => {
      await this.#modal.openModal({ uri })
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#provider.on('session_event', e => {
      this.#chainId = e?.params?.chainId.split(':')[1] ?? this.#chainId

      this.#address =
        e?.params?.event?.data?.[0]?.split(':')?.[2] ?? this.#address

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
        this.#defaultEventPayload,
      )
      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
        this.#defaultEventPayload,
      )
      this.emit(
        this.isConnected
          ? PROVIDER_EVENT_BUS_EVENTS.Connect
          : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
        this.#defaultEventPayload,
      )
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#provider.on('session_update', e => {
      this.#chainId =
        e?.params?.namespaces?.eip155?.chains?.[0].split(':')[1] ??
        this.#chainId

      this.#address =
        e?.params?.namespaces?.eip155?.accounts?.[0]?.split(':')?.[2] ??
        this.#address

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
        this.#defaultEventPayload,
      )
      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
        this.#defaultEventPayload,
      )
      this.emit(
        this.isConnected
          ? PROVIDER_EVENT_BUS_EVENTS.Connect
          : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
        this.#defaultEventPayload,
      )
    })

    // Subscribe to session delete
    this.#provider.on('session_delete', () => {
      this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
    })
  }
}
