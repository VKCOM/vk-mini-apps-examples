import React from 'react'
import { createRoot } from 'react-dom/client'
import bridge from '@vkontakte/vk-bridge'
import { ConfigProvider, AdaptivityProvider, AppRoot, WebviewType } from '@vkontakte/vkui'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import { router } from './routes'
import { Provider } from 'react-redux'
import { store } from './store'
import { App } from './App'

/** Подключаем стили vkui из собранной папки dist в node_modules/vkontakte/vkui/ */
import '@vkontakte/vkui/dist/vkui.css'
import '@vkontakte/vkui-tokens/themes/paradigmBase/cssVars/declarations/index.css'
/** Подключаем кастомные глобальные стили */
import 'src/index.css'

/** Метод инициализирующий мини-апп */
bridge.send('VKWebAppInit')

/**
 * ConfigProvider - прокидывает нужный config в соответствии c платформой(IOS, ANDROID, VK.COM) и выбранной темой [https://vkcom.github.io/VKUI/#/ConfigProvider]
 * Provider - прокидывает данные нашего state manager
 * AdaptivityProvider  - прокидывает данные адаптивности sizeX, sizeY [https://vkcom.github.io/VKUI/#/AdaptivityProvider]
 * AppRoot - компонент обертка, куда инкапсулирована логика режимов пожлкючения(Full, Partial, Embedded) [https://vkcom.github.io/VKUI/#/AppRoot]
 * RouterProvider - прокидывает состояние на    вигации в приложение
 */
const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
  <RouterProvider router={router}>
    <ConfigProvider webviewType={WebviewType.INTERNAL}>
      <Provider store={store}>
        <AdaptivityProvider>
          <AppRoot>
            <App />
          </AppRoot>
        </AdaptivityProvider>
      </Provider>
    </ConfigProvider>
  </RouterProvider>
)
