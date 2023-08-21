import { FC, memo } from 'react'
import {
  PanelHeaderProps,
  PanelHeader,
  PanelHeaderBack,
} from '@vkontakte/vkui'
import { useRouteNavigator, useFirstPageCheck } from '@vkontakte/vk-mini-apps-router'
import { INITIAL_URL } from 'src/routes'

export type CustomPanelHeaderProps = {
  title: string
} & PanelHeaderProps

/** PanelHeader c PanelHeaderBack */
let CustomPanelHeader: FC<CustomPanelHeaderProps> = ({ title, ...props }) => {
  const routeNavigator = useRouteNavigator()
  const isFirstPage = useFirstPageCheck()

  /** Делаем шаг назад в навигации или озвращаемся на стартовую старницу */
  const onHandleClick = () => {
    if (isFirstPage) routeNavigator.push(INITIAL_URL)
    else routeNavigator.back()
  }

  return (
    <PanelHeader
      before={<PanelHeaderBack onClick={onHandleClick} />}
      {...props}
    >
      {title}
    </PanelHeader>
  )
}

CustomPanelHeader = memo(CustomPanelHeader)
export { CustomPanelHeader }
