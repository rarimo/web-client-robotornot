import { CONFIG } from '@config'
import { Link, Stack } from '@mui/material'
import { useMemo } from 'react'
import { generatePath, NavLink } from 'react-router-dom'

import { Avatar } from '@/components'
import { RoutePaths } from '@/enums'

type AvatarNameProps = {
  imageUrl?: string
  name?: string
  address: string
  imageSize?: number | string
  fontSize?: number | string
  padding?: number | string
}

const AvatarName = ({
  imageUrl,
  name,
  address,
  imageSize,
  fontSize,
  padding,
}: AvatarNameProps) => {
  const route = useMemo(
    () =>
      address.startsWith(CONFIG.CHAIN_ID + 'valoper')
        ? generatePath(RoutePaths.Validator, { address })
        : generatePath(RoutePaths.Account, { address }),
    [address],
  )

  return (
    <Stack flexDirection={'row'} alignItems={'center'}>
      <Avatar address={address} imageUrl={imageUrl} imageSize={imageSize} />
      <Stack paddingLeft={padding || 1} sx={{ overflow: 'hidden' }}>
        <Link
          component={NavLink}
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
            fontSize: fontSize || '0.875rem',
          }}
          to={route}
        >
          {name || address}
        </Link>
      </Stack>
    </Stack>
  )
}

export default AvatarName
