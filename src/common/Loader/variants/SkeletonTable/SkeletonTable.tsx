import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { Skeleton } from '@/common/Loader/variants'

interface Props extends HTMLAttributes<HTMLDivElement> {
  rows: number
  schemes?: ('thin' | 'medium' | 'circle')[]
  sizing: string
}

const SkeletonTable: FC<Props> = ({
  rows,
  schemes = ['medium', 'medium', 'medium', 'medium', 'medium'],
  sizing,
  ...rest
}) => {
  return (
    <div className='skeleton-table' {...rest}>
      {Array(rows).map(row => (
        <div
          key={row}
          className='skeleton-table__row'
          style={{
            gridTemplateColumns: sizing,
          }}
        >
          {schemes.map((scheme, idx) => (
            <Skeleton key={idx} scheme={scheme} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default SkeletonTable
