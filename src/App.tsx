import React, { useEffect, useLayoutEffect } from 'react'
import {
  SplitLayout,
  SplitCol,
  View,
  Root,
  usePlatform,
  Platform,
  ScreenSpinner,
} from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import {
  useActiveVkuiLocation,
  usePopout,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOnboardingComplete, setUserName } from 'src/store/user.reducer'
import { Modals } from './modals'
import { Main, Store, CategoryList, ShoppingCart, ProductInfo } from './pages'
import { PaymentPanel, ShopView, ViewingPanel } from './routes'
import { getUserId } from './utils/getUserId'
import { fetchShop } from 'src/store/app.reducer'

export const App: React.FC = () => {
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
  const onboadrdingComplete = useAppSelector(
    (state) => state.user.onboadrdingComplete
  )

  /** Получение данных пользователя */
  useLayoutEffect(() => {
    async function initUser() {
      const userId = getUserId()

      const data = await bridge.send('VKWebAppStorageGet', {
        keys: [userId],
      })

      if (data.keys[0].value) dispatch(setUserName(data.keys[0].value))
      else {
        const userData = await bridge.send('VKWebAppGetUserInfo', {
          user_id: Number(userId),
        })

        if (userData) {
          dispatch(setUserName(userData.first_name))
          dispatch(setOnboardingComplete(false))
          bridge.send('VKWebAppStorageSet', {
            key: userId,
            value: userData.first_name,
          })
        }
      }
    }
    initUser()
  }, [dispatch, routeNavigator])

  /** Растягивание экрана на всю ширину окна для десктопа */
  useEffect(() => {
    if (platform === Platform.VKCOM) {
      bridge.send('VKWebAppResizeWindow', {
        width: 840,
        height: window.innerHeight,
      })
    }

    /** Callback срабатывающий после установки service worker */
    navigator.serviceWorker.ready.then(() => {
      /** Запрос на получение контента магазина */
      dispatch(fetchShop({ userId: getUserId() }))
    })
  }, [dispatch, platform])

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
