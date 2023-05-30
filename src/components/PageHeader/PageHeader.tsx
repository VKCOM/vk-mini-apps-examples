import React from 'react'
import {
  useFirstPageCheck,
  useRouteNavigator,
} from '@vkontakte/vk-mini-app-router'
import { IconButton } from '@vkontakte/vkui'
import { Icon28ArrowLeftOutline } from '@vkontakte/icons'

import './PageHeader.css'

export type PageHeaderProps = {
  header: string
}

let PageHeader: React.FC<PageHeaderProps> = ({ header }) => {
  const routeNavigator = useRouteNavigator()
  const isFirstPage = useFirstPageCheck()

  return (
    <div className="PageHeader">
      <IconButton
        aria-label="back"
        onClick={() =>
          isFirstPage ? routeNavigator.push('/') : routeNavigator.back()
        }
      >
        <Icon28ArrowLeftOutline fill="#2688EB" />
      </IconButton>
      <div className="PageHeader_title">{header}</div>
    </div>
  )
}

PageHeader = React.memo(PageHeader)
export { PageHeader }
