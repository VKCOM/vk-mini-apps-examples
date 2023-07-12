import { FC, useEffect, useLayoutEffect } from 'react'
import {
  SplitLayout,
  SplitCol,
  View,
  Root,
  usePlatform,
  Platform,
  ScreenSpinner,
} from '@vkontakte/vkui'
import bridge, { SharedUpdateConfigData } from '@vkontakte/vk-bridge'
import {
  useActiveVkuiLocation,
  usePopout,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { useAppDispatch, useAppSelector } from './store'
import { setOnboardingComplete, setUserData } from './store/user.reducer'
import { Modals } from './modals'
import { Main, Store, CategoryList, ShoppingCart, ProductInfo } from './pages'
import { PaymentPanel, ShopView, ViewingPanel } from './routes'
import { fetchShop } from './store/app.reducer'

export const App: FC = () => {
  /** Возвращает активное всплывающее окно | null */
  const routerPopout = usePopout()
  /** возвращает платформу IOS, ANDROID, VKCOM */
  const platform = usePlatform()
  /** возвращает объект с помощью которого можно совершать ахличные переходы в навигации */
  const routeNavigator = useRouteNavigator()
  /** Подписываемся на обновлнеие поля shopFetching, отвечающего за состояние загрузки контента магазина */
  const shopFetching = useAppSelector((state) => state.app.shopFetching)

  const {
    view: activeView = ViewingPanel.Main,
    panel: activePanel = ShopView.Viewing,
  } = useActiveVkuiLocation()

  const dispatch = useAppDispatch()
  const id = useAppSelector((state) => state.user.id)
  const onboadrdingComplete = useAppSelector(
    (state) => state.user.onboadrdingComplete
  )

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
  }, [dispatch, routeNavigator])

  /** Растягивание экрана на всю ширину окна для десктопа */
  useEffect(() => {
    /** Callback на изменение размеров страницы */
    async function iframeResize() {
      // Проверяем, что платформа VK.COM
      if (platform !== Platform.VKCOM) return

      // Получаем данные конфигурации
      const data = (await bridge.send(
        'VKWebAppGetConfig'
      )) as SharedUpdateConfigData

      // Обновляем размер страницы
      bridge.send('VKWebAppResizeWindow', {
        width: 840,
        height: data.viewport_height - 100,
      })
    }

    iframeResize()
    window.addEventListener('resize', iframeResize)

    return () => window.removeEventListener('resize', iframeResize)
  }, [platform])

  /** Запрос на получение контента магазина */
  useEffect(() => {
    if (!id) return

    /** Callback проверяющий установлен ли сервисный работник */
    navigator.serviceWorker.ready.then(() => {
      // Делаем запрос с задержкой, чтобы service-worker был готов отслеживать запросы на нашей странице
      setTimeout(() => {
        // Проверка, что данные магазина еще не были загружены
        if (shopFetching)
          /** Запрос на получение контента магазина */
          dispatch(fetchShop({ userId: id.toString() }))
      }, 10)
    })

    /** Callback приходящий на сообщение от sw при его регистрации*/
    navigator.serviceWorker.addEventListener('message', function () {
      setTimeout(() => {
        if (shopFetching)
          dispatch(fetchShop({ userId: id.toString() }))
      }, 10)
    })
  }, [id, shopFetching, dispatch])

  /** Loader на время получения контента магазина */
  useEffect(() => {
    if (shopFetching) routeNavigator.showPopout(<ScreenSpinner size="large" />)
    else routeNavigator.hidePopout()
  }, [shopFetching, routeNavigator])

  /** Открытие модалки при первом заходе в апп */
  useEffect(() => {
    if (!onboadrdingComplete) {
      routeNavigator.showModal('onboarding')
    }
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
        {/** activeView - активная View */}
        <Root activeView={activeView}>
          {/**
           * nav - путь в навигации
           * activePanel - активная Panel
           */}
          <View nav={ShopView.Viewing} activePanel={activePanel}>
            <Main nav={ViewingPanel.Main} />
            <Store nav={ViewingPanel.Store} />
            <CategoryList nav={ViewingPanel.CategoryList} />
            <ProductInfo nav={ViewingPanel.ProductInfo} />
          </View>

          <View nav={ShopView.Payment} activePanel={activePanel}>
            <ShoppingCart nav={PaymentPanel.ShoppingCart} />
          </View>
        </Root>
      </SplitCol>
    </SplitLayout>
  )
}
