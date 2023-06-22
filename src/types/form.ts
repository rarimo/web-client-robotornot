import {
  Control,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  FormState,
} from 'react-hook-form'

import { ProposalTypes } from '@/enums'

export type NestedFormProps<T extends FieldValues> = {
  control: Control<T>
  isFormDisabled: boolean
  formErrors: Partial<FieldErrorsImpl<T>>
  getErrorMessage: (error?: FieldError) => string
}
export type FormProps = {
  id: string
  onSubmit: (params: { message: string }) => void
  setIsDialogDisabled: (isDisabled: boolean) => void
}

export type useProposalFormProps<T extends FieldValues> = {
  type: Partial<ProposalTypes>
  control: Control<T>
  formState?: FormState<FieldValues>
  isFormDisabled: boolean
  formErrors: Partial<FieldErrorsImpl<T>>
  getErrorMessage: (error?: FieldError) => string
}
