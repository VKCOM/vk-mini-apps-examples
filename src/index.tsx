import React from 'react'
import ReactDOM from 'react-dom'
import bridge from '@vkontakte/vk-bridge'
import { ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import { router } from './routes'
import { Provider } from 'react-redux'
import { store } from './store'
import { App } from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import '@vkontakte/vkui/dist/vkui.css'
import 'src/index.css'
/** Метод инициализирующий мини-апп */
bridge.send('VKWebAppInit')

ReactDOM.render(
  <ConfigProvider>
    <Provider store={store}>
      <AdaptivityProvider>
        <AppRoot>
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </AppRoot>
      </AdaptivityProvider>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
)

serviceWorkerRegistration.register()
