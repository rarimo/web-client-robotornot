import './styles.scss'

import { motion, MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorMessage, Loader, NoDataMessage } from '@/common'
import { ErrorHandler, sleep } from '@/helpers'
import { postsStore } from '@/store'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

const StoreOverview: FC<Props> = ({ ...rest }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const { t } = useTranslation()

  const init = useCallback(async () => {
    try {
      await sleep(1000)
      await postsStore.loadPosts()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return (
    <motion.div className='store-overview' {...rest}>
      {isLoaded ? (
        isLoadFailed ? (
          <ErrorMessage message={t('store-overview.loading-error-msg')} />
        ) : postsStore.posts &&
          Array.isArray(postsStore.posts) &&
          postsStore.posts.length ? (
          <div className='store-overview__list'>
            {postsStore.posts.map((el, idx) => (
              <div className='store-overview__card' key={el.id}>
                <span className='store-overview__card-title'>
                  {`${idx + 1}. ${el.title}`}
                </span>
                <p className='store-overview__card-body'>{el.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <NoDataMessage message={t('store-overview.no-data-msg')} />
        )
      ) : (
        <Loader />
      )}
    </motion.div>
  )
}

export default StoreOverview
