import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@/components'

interface DialogFormWrapperProps {
  formId: string
  title: string
  isDisabled: boolean
  isDialogOpened: boolean
  closeDialog: () => void
  children: JSX.Element
  actionBtnText?: string
}

const DialogFormWrapper = ({
  children,
  formId,
  title,
  isDisabled,
  isDialogOpened,
  closeDialog,
  actionBtnText,
}: DialogFormWrapperProps) => {
  const { t } = useTranslation()

  return (
    <Dialog
      action={[
        <Button
          variant='outlined'
          onClick={closeDialog}
          key='cancel'
          disabled={isDisabled}
        >
          {t('common.cancel-btn')}
        </Button>,
        <Button type='submit' form={formId} key='submit' disabled={isDisabled}>
          {actionBtnText || t('common.create-btn')}
        </Button>,
      ]}
      onClose={closeDialog}
      isOpened={isDialogOpened}
      title={title}
    >
      {children}
    </Dialog>
  )
}

export default DialogFormWrapper
