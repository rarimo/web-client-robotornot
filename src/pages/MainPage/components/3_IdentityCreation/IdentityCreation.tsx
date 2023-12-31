import './styles.scss'

import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect, useState } from 'react'
import { useKey } from 'react-use'

import { AppButton, Icon } from '@/common'
import { useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const IdentityCreation: FC<StepProps> = ({
  nextStepCb,
  className,
  ...rest
}) => {
  const [isPending, setIsPending] = useState(false)

  const { identityIdString, createIdentity } = useZkpContext()

  const requestCreateIdentity = useCallback(async () => {
    setIsPending(true)

    try {
      await createIdentity()
    } catch (error) {
      ErrorHandler.process(error)

      setIsPending(false)
    }
  }, [createIdentity])

  useKey('Enter', requestCreateIdentity)

  useEffect(() => {
    if (!identityIdString) return

    nextStepCb()
  }, [identityIdString, nextStepCb])

  return (
    <motion.div
      className={['identity-creation', className].join(' ')}
      {...rest}
    >
      <h2 className='identity-creation identity-creation__title'>{`Welcome!`}</h2>

      <span className='app__step-subtitle identity-creation__subtitle'>
        {`Create a profile so you can use your identity with ZK-protected privacy`}
      </span>

      <div className='app__step-actions'>
        <AppButton
          onClick={requestCreateIdentity}
          text={`Create profile`}
          modification='border-circle'
          isDisabled={isPending}
        />

        <div className='app__step-actions-tip'>
          <span className='app__step-actions-tip-text'>
            {`Or press`}

            <span className='app__step-actions-tip-text--accent'>
              {`Enter`}
            </span>
          </span>
          <Icon
            className='app__step-actions-tip-icon'
            name={ICON_NAMES.keyboardReturn}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default IdentityCreation
