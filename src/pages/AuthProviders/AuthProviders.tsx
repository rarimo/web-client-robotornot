import './styles.scss'

import { AuthZkp, type VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'
import { ZKP_OPERATORS, ZkpGen } from '@rarimo/zkp-gen-iden3'
import isEmpty from 'lodash/isEmpty'
import { FC, HTMLAttributes, useCallback, useState } from 'react'

import { AppButton, Loader } from '@/common'
import { useWeb3Context } from '@/contexts'
import { InputField } from '@/fields'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

type QueryVariableName = { isNatural: number }

const AuthProviders: FC<Props> = () => {
  const { provider } = useWeb3Context()

  const [isPending, setIsPending] = useState(false)

  const [pkInput, setPkInput] = useState<string>('')

  const [identity, setIdentity] = useState<Identity>()
  const [verifiableCredentials, setVerifiableCredentials] =
    useState<VerifiableCredentials<QueryVariableName>>()
  const [isNaturalProof, setIsNaturalProof] =
    useState<ZkpGen<QueryVariableName>>()

  const createIdentity = useCallback(async () => {
    Identity.setConfig({
      AUTH_BJJ_CREDENTIAL_HASH: 'cca3371a6cb1b715004407e325bd993c',
    })
    setIdentity(await Identity.create(pkInput))
  }, [pkInput])

  const validateIdentity = useCallback(async () => {
    const newIdentity = await Identity.create(identity?.privateKeyHex)

    alert(newIdentity.identityIdString === identity?.identityIdString)
  }, [identity?.identityIdString, identity?.privateKeyHex])

  // Verifiable credentials
  const getVerifiableCredentials = useCallback(async () => {
    if (!identity) return

    setIsPending(true)
    try {
      AuthZkp.setConfig({
        RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
        STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
        ISSUER_API_URL: 'http://127.0.0.1:8000/',
      })
      const authProof = new AuthZkp<QueryVariableName>(identity)

      setVerifiableCredentials(await authProof.getVerifiableCredentials())
    } catch (error) {
      ErrorHandler.process(error)
    }
    setIsPending(false)
  }, [identity])

  const proveIsNatural = useCallback(async () => {
    if (!identity) return

    setIsPending(true)
    try {
      ZkpGen.setConfig({
        RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
        STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
        ISSUER_API_URL: 'http://127.0.0.1:8000/',
      })

      const zkProof = new ZkpGen<QueryVariableName>({
        requestId: '1',
        identity: identity,
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
  }, [identity, provider?.address, verifiableCredentials])

  return (
    <div className='auth-providers'>
      <InputField
        className='auth-providers__input'
        label={`Private key`}
        value={pkInput}
        updateValue={setPkInput}
      />
      <div className='auth-providers__actions'>
        <AppButton text={`Create Identity`} onClick={createIdentity} />
        <AppButton text={`Validate Identity`} onClick={validateIdentity} />
      </div>
      <div className='auth-providers__metadata'>
        <div className='auth-providers__metadata-row'>
          <span className='auth-providers__metadata-col'>{`private`}</span>
          <span className='auth-providers__metadata-col'>
            {identity?.privateKeyHex}
          </span>
        </div>

        <div className='auth-providers__metadata-row'>
          <span className='auth-providers__metadata-col'>{`public`}</span>
          <span className='auth-providers__metadata-col'>
            {identity?.identityIdString}
          </span>
        </div>
      </div>

      {isPending ? (
        <Loader />
      ) : (
        <>
          <AppButton
            onClick={getVerifiableCredentials}
            text={`Generate Auth Proof`}
            isDisabled={
              !identity?.identityIdString || !isEmpty(verifiableCredentials)
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
