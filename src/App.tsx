import { FC, useEffect, useLayoutEffect } from 'react'
import {
  SplitLayout,
  SplitCol,
  View,
  usePlatform,
  Platform,
  Epic,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import bridge, { SharedUpdateConfigData } from '@vkontakte/vk-bridge'
import {
  useActiveVkuiLocation,
  usePopout,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { useAppDispatch, useAppSelector } from './store'
import { selectOnboardingComplete, setOnboardingComplete, setUserData } from './store/user.reducer'
import { Modals } from './modals'
import { Store, ShoppingCart, ProductInfo } from './pages'
import { PaymentPanel, ShopView, ViewingPanel } from './routes'
import { fetchShop } from './store/app.reducer'
import { CustomTabbar } from './components'

const APP_WIDTH = 911
const APP_PADDING = 100

export const App: FC = () => {
  /** Возвращает активное всплывающее окно | null */
  const routerPopout = usePopout()
  /** возвращает платформу IOS, ANDROID, VKCOM */
  const platform = usePlatform()
  /** возвращает объект с помощью которого можно совершать переходы в навигации */
  const routeNavigator = useRouteNavigator()
  /** Подписываемся на обновлнеие поля shopFetching, отвечающего за состояние загрузки контента магазина */
  const onboadrdingComplete = useAppSelector(selectOnboardingComplete)
  
  const dispatch = useAppDispatch()
  const {
    view: activeView = ViewingPanel.Store,
    panel: activePanel = ShopView.Viewing,
  } = useActiveVkuiLocation()

  const { isDesktop } = useAdaptivityWithJSMediaQueries()

  /** Получение данных пользователя */
  useLayoutEffect(() => {
    async function initUser() {
      // Получаем данные текущего пользователя
      const userData = await bridge.send('VKWebAppGetUserInfo', {})

      // Проверяем есть ли он в Storage
      const data = await bridge.send('VKWebAppStorageGet', {
        keys: [userData.id.toString()],
      })

      // Если он уже сохранен, то сохраняем его имя в store
      if (data.keys[0].value)
        dispatch(setUserData({ name: data.keys[0].value, id: userData.id }))
      // Если не сохранен, то сохраняем в store и показываем приветственную модалку
      else if (userData) {
        dispatch(setUserData({ name: userData.first_name, id: userData.id }))
        dispatch(setOnboardingComplete(false))
        bridge.send('VKWebAppStorageSet', {
          key: userData.id.toString(),
          value: userData.first_name,
        })
      }
    }

    initUser()
  }, [dispatch])

  /** Растягивание экрана на всю ширину окна для десктопа */
  useEffect(() => {
    /** Callback на изменение размеров страницы */
    async function iframeResize() {
      // Проверяем, что платформа VK.COM
      if (platform !== Platform.VKCOM) return

      // Получаем данные конфигурации
      const { viewport_height } = (await bridge.send(
        'VKWebAppGetConfig'
      )) as SharedUpdateConfigData

      // Обновляем размер страницы
      bridge.send('VKWebAppResizeWindow', {
        width: APP_WIDTH,
        height: viewport_height - APP_PADDING,
      })
    }

    iframeResize()
    window.addEventListener('resize', iframeResize)

    return () => window.removeEventListener('resize', iframeResize)
  }, [platform])

  /** Запрос на получение контента магазина */
  useEffect(() => {
    dispatch(fetchShop())
  }, [dispatch])

  /** Открытие модалки при первом заходе в апп */
  useEffect(() => {
    if (!onboadrdingComplete) routeNavigator.showModal('onboarding')
  }, [onboadrdingComplete, routeNavigator])


  /**
   * SplitLayout - Компонент-контейнер для реализации интерфейса с многоколоночной структурой [https://vkcom.github.io/VKUI/#/SplitLayout]
   * SplitCol Компонент-обертка для отрисовки колонки в многоколоночном интерфейсе. [https://vkcom.github.io/VKUI/#/SplitCol]
   * Root - хранилище View [https://vkcom.github.io/VKUI/#/Root]
   * View - хранилище Panel [https://vkcom.github.io/VKUI/#/View]
   * Panel - контент одной страницы [https://vkcom.github.io/VKUI/#/Panel]
   */
  return (
    /**
     * popout - свойство для отрисовки Alert ActionSheet ScreenSpinner
     * modal - свойство для отрисовки модальных страниц(ModalRoot)
     */
    <SplitLayout popout={routerPopout} modal={<Modals />}>
      <SplitCol>
        <Epic
          activeStory={activeView}
          tabbar={!isDesktop && <CustomTabbar activeView={activeView} />}
        >
          <View nav={ShopView.Viewing} activePanel={activePanel}>
            <Store nav={ViewingPanel.Store} />
            <ProductInfo nav={ViewingPanel.ProductInfo} />
          </View>

          <View nav={ShopView.Payment} activePanel={activePanel}>
            <ShoppingCart nav={PaymentPanel.ShoppingCart} />
          </View>
        </Epic>
      </SplitCol>
    </SplitLayout>
  )
}
