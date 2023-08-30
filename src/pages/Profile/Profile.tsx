import './styles.scss'

import { FC, HTMLAttributes, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilePicker } from 'use-file-picker'

import { AppButton, Icon } from '@/common'
import { useZkpContext } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { abbrCenter, ErrorHandler } from '@/helpers'

const Profile: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const navigate = useNavigate()

  const { identity, verifiableCredentials, createIdentity, reset } =
    useZkpContext()
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

  const handleBackRouting = useCallback(() => {
    if (verifiableCredentials?.id) {
      navigate(-1)
    } else {
      navigate(RoutesPaths.authProviders)
    }
  }, [navigate, verifiableCredentials?.id])

  useEffect(() => {
    if (!filesContent?.[0]?.content) return

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
      <AppButton
        className='profile__back-btn'
        iconLeft={ICON_NAMES.chevronLeft}
        scheme='none'
        size='none'
        onClick={handleBackRouting}
      />

      <div className='profile__header'>
        <div className='profile__header-icon-wrp'>
          <Icon className='profile__header-icon' name={ICON_NAMES.user} />
        </div>
        <h2 className='profile__header-title' title={identity?.idString}>
          {`did:rarimo:${abbrCenter(identity?.idString ?? '', 4)}`}
        </h2>
      </div>

      <div className='profile__card'>
        <span className='profile__card-title'>
          {`Preserve these credentials for profile restoration or cross-device use`}
        </span>

        <div className='profile__copy-field-wrp'>
          <div className='profile__copy-field'>
            {abbrCenter(identity?.idString ?? '', 10)}

            {identity?.privateKeyHex ? (
              <div className='profile__copy-field-btns-wrp'>
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
                <AppButton
                  className='profile__copy-field-btn profile__copy-field-btn--reset'
                  modification='none'
                  iconLeft={ICON_NAMES.trash}
                  size='small'
                  onClick={reset}
                />
              </div>
            ) : (
              <AppButton
                className='profile__copy-field-btn'
                modification='none'
                iconLeft={ICON_NAMES.download}
                text={`CREATE`}
                size='small'
                onClick={() => createIdentity()}
              />
            )}
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
