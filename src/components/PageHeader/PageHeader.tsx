import React, { useCallback } from 'react'
import {
  useFirstPageCheck,
  useRouteNavigator,
} from '@vkontakte/vk-mini-app-router'
import { Icon28ArrowLeftOutline } from '@vkontakte/icons'
import { IconButton } from '@vkontakte/vkui'
import { INITIAL_URL } from 'src/routes'

import './PageHeader.css'

export type PageHeaderProps = {
  header: string
}

let PageHeader: React.FC<PageHeaderProps> = ({ header }) => {
  const routeNavigator = useRouteNavigator()
  const isFirstPage = useFirstPageCheck()

  const onBackButtonClick = useCallback(() => {
    isFirstPage ? routeNavigator.push(INITIAL_URL) : routeNavigator.back()
  }, [routeNavigator, isFirstPage])

  return (
    <div className="PageHeader">
      <IconButton aria-label="back" onClick={onBackButtonClick}>
        <Icon28ArrowLeftOutline fill="#2688EB" />
      </IconButton>
      <div className="PageHeader_title">{header}</div>
    </div>
  )
}

PageHeader = React.memo(PageHeader)
export { PageHeader }
