import './styles.scss'

import { FC, HTMLAttributes, useEffect, useMemo } from 'react'
import { useFilePicker } from 'use-file-picker'

import { AppButton, Icon } from '@/common'
import { useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, ErrorHandler } from '@/helpers'

const Profile: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { identity, createIdentity } = useZkpContext()
  const [openFileSelector, { filesContent, clear }] = useFilePicker({
    accept: '.json',
  })

  const exportLink = useMemo(() => {
    if (!identity?.privateKeyHex) return

    const blob = new Blob([identity.privateKeyHex], {
      type: 'application/json',
    })

    return URL.createObjectURL(blob)
  }, [identity?.privateKeyHex])

  useEffect(() => {
    if (identity?.privateKeyHex || !filesContent?.[0]?.content) return

    const setIdentity = async () => {
      await createIdentity(filesContent[0].content)

      clear()
    }

    try {
      setIdentity()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [clear, createIdentity, filesContent, identity?.privateKeyHex])

  return (
    <div className='profile'>
      <div className='profile__header'>
        <div className='profile__header-icon-wrp'>
          <Icon className='profile__header-icon' name={ICON_NAMES.user} />
        </div>
        <h2 className='profile__header-title'>
          {`DID:Rarimo:${abbrCenter(identity?.idString ?? '', 4)}`}
        </h2>
        <span className='profile__header-subtitle'>
          {`Show your private key`}
        </span>
      </div>

      <div className='profile__card'>
        <span className='profile__card-title'>
          {`Preserve or Utilize These Keys for Profile Restoration or Cross-Device use`}
        </span>

        <div className='profile__copy-field-wrp'>
          <div className='profile__copy-field'>
            {abbrCenter(identity?.idString ?? '', 10)}
            <AppButton
              className='profile__copy-field-btn'
              modification='none'
              iconLeft={ICON_NAMES.download}
              href={exportLink}
              target='_blank'
              download={`pk.json`}
              text={`EXPORT`}
              size='small'
            />
          </div>
        </div>
      </div>

      <div className='profile__tip'>
        {`Would you like to restore some other account? `}
        <button className='profile__tip-link' onClick={openFileSelector}>
          {`Import Key`}
        </button>
      </div>
    </div>
  )
}

export default Profile
