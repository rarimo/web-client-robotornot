import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import {
  DeepPartial,
  FieldError,
  useForm as useFormHook,
} from 'react-hook-form'
import * as Yup from 'yup'

export const useForm = <T extends Yup.AnyObjectSchema, R extends object>(
  defaultValues: R,
  schemaBuilder: (yup: typeof Yup) => T,
) => {
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormHook({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldUseNativeValidation: false,
    defaultValues: defaultValues as DeepPartial<R>,
    resolver: yupResolver(schemaBuilder(Yup)),
  })

  const getErrorMessage = (error?: FieldError) => {
    return error?.message ?? ''
  }

  const disableForm = () => {
    setIsFormDisabled(true)
  }

  const enableForm = () => {
    setIsFormDisabled(false)
  }

  return {
    isFormDisabled,
    getErrorMessage,
    enableForm,
    disableForm,
    formState: watch(),
    formErrors: errors,
    register,
    handleSubmit,
    control,
  }
}
