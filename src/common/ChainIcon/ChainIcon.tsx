import './styles.scss'

import { FC, HTMLAttributes, useMemo } from 'react'

import { Icon } from '@/common'
import { SUPPORTED_CHAINS } from '@/config'
import { ICON_NAMES } from '@/enums'
import { getChainIcon } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  chain: SUPPORTED_CHAINS
}

const ChainIcon: FC<Props> = ({ chain, className, ...rest }) => {
  const [isChainIconIsUrl, chainIcon] = useMemo(
    () => getChainIcon(chain),
    [chain],
  )

  return isChainIconIsUrl ? (
    <img
      {...rest}
      className={`chain-icon ${className}`}
      src={chainIcon}
      alt={chain}
    />
  ) : (
    <Icon
      {...rest}
      className={`chain-icon ${className}`}
      name={chainIcon as ICON_NAMES}
    />
  )
}

export default ChainIcon
