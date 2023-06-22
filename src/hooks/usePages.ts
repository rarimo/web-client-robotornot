import {
  DataTransferBoth,
  LineSpace,
  Notes,
  Svg3DSelectSolid,
  UserScan,
} from 'iconoir-react'
import { useTranslation } from 'react-i18next'

import { RoutePaths } from '@/enums'

export const usePages = () => {
  const { t } = useTranslation()

  return [
    {
      name: t('app-pages.validators-lbl'),
      path: RoutePaths.Validators,
      icon: UserScan,
      href: '',
    },
    {
      name: t('app-pages.proposals-lbl'),
      path: RoutePaths.Proposals,
      icon: Notes,
      href: '',
    },
    {
      name: t('app-pages.transactions-lbl'),
      path: RoutePaths.Transactions,
      icon: DataTransferBoth,
      href: '',
    },
    {
      name: t('app-pages.blocks-lbl'),
      path: RoutePaths.Blocks,
      icon: Svg3DSelectSolid,
      href: '',
    },
    {
      name: t('app-pages.params-lbl'),
      path: RoutePaths.Params,
      icon: LineSpace,
      href: '',
    },
  ]
}
