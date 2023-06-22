import { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { I18nKey } from '@/types'

const I18nT = <S extends string>({
  path,
  children,
  values,
}: {
  path: I18nKey<S> | I18nKey<S>[]
  children:
    | readonly ReactElement[]
    | { readonly [tagName: string]: ReactElement }
  values?: Record<string, string | number | undefined>
}) => {
  const { t } = useTranslation()

  return (
    <Trans
      t={t}
      i18nKey={path}
      components={Array.isArray(children) ? children : [children]}
      values={values}
    />
  )
}

export default I18nT
