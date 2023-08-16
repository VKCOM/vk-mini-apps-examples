import { FC, memo } from 'react'
import { PanelHeaderProps, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

export type CustomPanelHeaderProps = {
  title: string
} & PanelHeaderProps

let CustomPanelHeader: FC<CustomPanelHeaderProps> = ({ title }) => {
  const routeNavigator = useRouteNavigator()

  return (
    <PanelHeader
      before={<PanelHeaderBack onClick={() => routeNavigator.back() }/>}
    >
      {title}
    </PanelHeader>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
CustomPanelHeader = memo(CustomPanelHeader)
export { CustomPanelHeader }
