import { time } from '@distributedlab/tools'
import { Link } from '@mui/material'
import { Svg3DSelectSolid } from 'iconoir-react'
import { useTranslation } from 'react-i18next'
import { generatePath, NavLink } from 'react-router-dom'

import { AvatarName, NoDataRow, PreviewList, RowComponent } from '@/components'
import { RoutePaths } from '@/enums'
import { Block, BlockBaseFragment } from '@/types'

interface LatestBlockProps {
  isLoadingError: boolean
  isLoading: boolean
  blockList: BlockBaseFragment[]
  limitRow: number
}

const DashboardLatestBlocks = ({
  isLoading,
  isLoadingError,
  blockList,
  limitRow,
}: LatestBlockProps) => {
  const { t } = useTranslation()

  return (
    <PreviewList
      actions={{ label: t('block-list.view-all'), link: RoutePaths.Blocks }}
      title={t('block-list.title')}
      isError={isLoadingError}
      isLoading={isLoading}
    >
      <>
        {!isLoading && (!blockList.length || isLoadingError) && (
          <NoDataRow
            message={t('block-list.no-data-msg')}
            error={isLoadingError}
          />
        )}
        {(isLoading
          ? new Array(limitRow).fill({} as BlockBaseFragment)
          : blockList
        ).map((el: Block, idx) => (
          <RowComponent
            key={idx}
            isLoading={isLoading}
            head={
              <Link
                component={NavLink}
                to={generatePath(RoutePaths.Block, {
                  height: String(el.height),
                })}
              >
                {el?.height}
              </Link>
            }
            footer={<>{time(el.timestamp, { utc: true }).fromNow}</>}
            subfooter={
              <AvatarName
                address={el?.validator?.validator_info?.operator_address ?? ''}
                name={el?.validator?.validator_descriptions?.[0]?.moniker ?? ''}
                imageUrl={
                  el?.validator?.validator_descriptions?.[0]?.avatar_url ?? ''
                }
                imageSize={'18px'}
                fontSize={'12px'}
                padding={0.5}
              />
            }
            subhead={<>{t('block-list.validator')}:</>}
            icon={<Svg3DSelectSolid width={35} height={35} />}
          />
        ))}
      </>
    </PreviewList>
  )
}
export default DashboardLatestBlocks
