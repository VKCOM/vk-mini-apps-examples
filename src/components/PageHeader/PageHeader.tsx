import { FC, memo, useCallback } from 'react'
import {
  useFirstPageCheck,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { Icon28ArrowLeftOutline } from '@vkontakte/icons'
import { IconButton } from '@vkontakte/vkui'
import { INITIAL_URL } from 'src/routes'
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme'

import './PageHeader.css'

export type PageHeaderProps = {
  header: string
}

let PageHeader: FC<PageHeaderProps> = ({ header }) => {
  // Получаем объект для навигации по приложению
  const routeNavigator = useRouteNavigator()
  // Проверка является ли текущая страница первой в истории навигации
  const isFirstPage = useFirstPageCheck()

  const onBackButtonClick = useCallback(() => {
    isFirstPage ? routeNavigator.push(INITIAL_URL) : routeNavigator.back()
  }, [routeNavigator, isFirstPage])

  return (
    <div className="PageHeader">
      <IconButton aria-label="back" onClick={onBackButtonClick}>
        <Icon28ArrowLeftOutline
          fill={baseTheme.colorPanelHeaderIcon.active.value}
        />
      </IconButton>
      <div className={'PageHeader_title'}>{header}</div>
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
PageHeader = memo(PageHeader)
export { PageHeader }
