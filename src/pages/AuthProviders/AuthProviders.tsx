import './styles.scss'

import { AuthZkp, type VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'
import { ZKP_OPERATORS, ZkpGen } from '@rarimo/zkp-gen-iden3'
import isEmpty from 'lodash/isEmpty'
import { FC, HTMLAttributes, useCallback, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useSnapshot } from 'valtio'

import { AppButton, Loader } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'
import { identityStore } from '@/store'

type Props = HTMLAttributes<HTMLDivElement>

type QueryVariableName = { isNatural: number }

const AuthProviders: FC<Props> = () => {
  const identityStoreSnap = useSnapshot(identityStore)
  const { provider } = useWeb3Context()

  const [isPending, setIsPending] = useState(false)
  const [verifiableCredentials, setVerifiableCredentials] =
    useState<VerifiableCredentials<QueryVariableName>>()
  const [, setAuthZkp] = useState<AuthZkp<QueryVariableName>>()
  const [isNaturalProof, setIsNaturalProof] =
    useState<ZkpGen<QueryVariableName>>()

  const init = useCallback(async () => {
    await identityStoreSnap.init()
  }, [identityStoreSnap])

  // Verifiable credentials
  const getClaim = useCallback(async () => {
    setIsPending(true)
    try {
      AuthZkp.setConfig({
        RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
        STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
        ISSUER_API_URL: 'http://127.0.0.1:8000/',
      })
      const authProof = new AuthZkp<QueryVariableName>(
        identityStoreSnap.identity as Identity,
      )
      setAuthZkp(authProof)

      setVerifiableCredentials(await authProof.getVerifiableCredentials())
    } catch (error) {
      ErrorHandler.process(error)
    }
    setIsPending(false)
  }, [identityStoreSnap.identity])

  const proveIsNatural = useCallback(async () => {
    setIsPending(true)
    try {
      ZkpGen.setConfig({
        RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
        STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
        ISSUER_API_URL: 'http://127.0.0.1:8000/',
      })

      const zkProof = new ZkpGen<QueryVariableName>({
        requestId: '1',
        identity: identityStoreSnap.identity as Identity,
        verifiableCredentials:
          verifiableCredentials as VerifiableCredentials<QueryVariableName>,

        challenge: String(provider?.address).substring(2),

        query: {
          variableName: 'isNatural',
          operator: ZKP_OPERATORS.EQUALS,
          value: ['1'],
        },
      })

      await zkProof.generateProof()

      setIsNaturalProof(zkProof)
    } catch (error) {
      ErrorHandler.process(error)
    }
    setIsPending(false)
  }, [identityStoreSnap.identity, provider?.address, verifiableCredentials])

  useEffectOnce(() => {
    init()
  })

  return (
    <div className='auth-providers'>
      <table className='auth-providers__table'>
        <thead>
          <tr>
            <th>{`private`}</th>
            <th>{`body`}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{identityStoreSnap.identity.privateKeyHex}</td>
            <td>{identityStoreSnap.identity.identityIdString}</td>
          </tr>
        </tbody>
      </table>

      {isPending ? (
        <Loader />
      ) : (
        <>
          <AppButton
            onClick={getClaim}
            text={`Generate Auth Proof`}
            isDisabled={
              !identityStoreSnap?.identity?.identityIdString ||
              !isEmpty(verifiableCredentials)
            }
          />
          <AppButton
            onClick={proveIsNatural}
            text={`Generate isNatural prove`}
            isDisabled={
              isEmpty(verifiableCredentials) || !isEmpty(isNaturalProof)
            }
          />
          <AppButton
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log(isNaturalProof)
            }}
            text={`log zkp`}
            isDisabled={isEmpty(isNaturalProof)}
          />
        </>
      )}

      <AppButton
        text={`Clear isNaturalProve`}
        onClick={() => {
          setIsPending(false)
          setIsNaturalProof(undefined)
        }}
      />
    </div>
  )
}

export default AuthProviders
