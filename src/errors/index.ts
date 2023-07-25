import { errors as serverErrors } from '@distributedlab/jac'
import { errors as providerErrors } from '@distributedlab/w3p'

export const errors = {
  ...providerErrors,
  ...serverErrors,
}
