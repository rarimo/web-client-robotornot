import { useState } from 'react'

import { Bus } from '@/helpers'

export const useContentSectionAction = (
  onSubmitHandler?: () => Promise<void>,
) => {
  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const openDialog = () => {
    setIsDialogOpened(true)
  }

  const closeDialog = () => {
    setIsDialogOpened(false)
  }

  const onSubmit = async (params: { message: string }) => {
    if (isDialogOpened) closeDialog()

    Bus.success(params.message)
    if (onSubmitHandler) await onSubmitHandler()
  }

  return {
    isDialogOpened,
    isDisabled,
    openDialog,
    closeDialog,
    onSubmit,
    setIsDisabled,
  }
}
