import React, { useCallback } from 'react'
import {
  useFirstPageCheck,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { Icon28ArrowLeftOutline } from '@vkontakte/icons'
import { IconButton, useAdaptivityWithJSMediaQueries } from '@vkontakte/vkui'
import { INITIAL_URL } from 'src/routes'
import cx from 'classnames'

import './PageHeader.css'

export type PageHeaderProps = {
  header: string
}

let PageHeader: React.FC<PageHeaderProps> = ({ header }) => {
  const routeNavigator = useRouteNavigator()
  const isFirstPage = useFirstPageCheck()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()

  const onBackButtonClick = useCallback(() => {
    isFirstPage ? routeNavigator.push(INITIAL_URL) : routeNavigator.back()
  }, [routeNavigator, isFirstPage])

  return (
    <div className="PageHeader">
      <IconButton aria-label="back" onClick={onBackButtonClick}>
        <Icon28ArrowLeftOutline fill="#2688EB" />
      </IconButton>
      <div
        className={cx('PageHeader_title', {
          PageHeader_title__desktop: isDesktop,
        })}
      >
        {header}
      </div>
    </div>
  )
}

PageHeader = React.memo(PageHeader)
export { PageHeader }
