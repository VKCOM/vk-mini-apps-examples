import bridge, {
  parseURLSearchParamsForGetLaunchParams,
} from '@vkontakte/vk-bridge'
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  Appearance,
} from '@vkontakte/vkui'
import {
  useAppearance,
  useAdaptivity,
  useInsets,
} from '@vkontakte/vk-bridge-react'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import { router } from './routes'
import { Provider } from 'react-redux'
import { store } from './store'
import { App } from './App'
import { transformVKBridgeAdaptivity } from './utils'

export const AppConfig = () => {
  const vkBridgeAppearance = useAppearance() || undefined
  const vkBridgeInsets = useInsets() || undefined
  const adaptivity = transformVKBridgeAdaptivity(useAdaptivity())
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(
    window.location.search
  )

  /**
   * ConfigProvider - прокидывает нужный config в соответствии c платформой(IOS, ANDROID, WEB) и выбранной темой [https://vkcom.github.io/VKUI/#/ConfigProvider]
   * Provider - прокидывает данные нашего state manager
   * AdaptivityProvider  - прокидывает данные адаптивности sizeX, sizeY [https://vkcom.github.io/VKUI/#/AdaptivityProvider]
   * AppRoot - компонент обертка, куда инкапсулирована логика режимов пожлкючения(Full, Partial, Embedded) [https://vkcom.github.io/VKUI/#/AppRoot]
   */
  return (
    <ConfigProvider
      appearance={vkBridgeAppearance ?? Appearance.LIGHT}
      platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
      isWebView={bridge.isWebView()}
      hasCustomPanelHeaderAfter={true}
    >
      <AdaptivityProvider {...adaptivity}>
        <AppRoot mode="full" safeAreaInsets={vkBridgeInsets}>
          <Provider store={store}>
            <RouterProvider router={router}>
              <App />
            </RouterProvider>
          </Provider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}
