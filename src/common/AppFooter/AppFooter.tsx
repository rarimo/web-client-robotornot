import './styles.scss'

import { FC, HTMLAttributes } from 'react'

const AppFooter: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  return (
    <div className={`app-footer ${className}`} {...rest}>
      <span className='app-footer__copyright'>
        {`© ${new Date().getFullYear()} Rarimo`}
      </span>
    </div>
  )
}

export default AppFooter
