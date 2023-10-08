import { useContext } from 'react'

import { formStepperContext } from '@/contexts/FormStepperContext/FormStepperContext'

export const useFormStepperContext = () => {
  const formStepper = useContext(formStepperContext)

  return {
    ...formStepper,
  }
}
