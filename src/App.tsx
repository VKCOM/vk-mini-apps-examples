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
import { setOnboardingComplete, setUserName } from 'src/store/user'
import { Modals } from './modals'
import { Main, Store, CategoryList, ShoppingCart, ProductInfo } from './pages'
import { PaymentPanel, ShopView, ViewingPanel } from './routes'
import { getUserId } from './utils/getUserId'
import { fetchShop } from './store/app'

export const App: React.FC = () => {
  const routerPopout = usePopout()
  const platform = usePlatform()
  const routeNavigator = useRouteNavigator()
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

    navigator.serviceWorker.ready.then(() => {
      dispatch(fetchShop({ userId: getUserId() }))
    })
  }, [dispatch, platform])

  /** Loader на время получения initialData */
  useEffect(() => {
    if (shopFetching) {
      setTimeout(() => {
        routeNavigator.showPopout(<ScreenSpinner size="large" />)
      }, 100)
    }
    if (!shopFetching) {
      setTimeout(() => {
        routeNavigator.hidePopout()
      }, 1500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopFetching])

  /** Открытие модалки при первом заходе в апп */
  useEffect(() => {
    if (!onboadrdingComplete) {
      routeNavigator.showModal('onboarding')
    }
  }, [onboadrdingComplete, routeNavigator])

  return (
    <SplitLayout popout={routerPopout} modal={<Modals />}>
      <SplitCol>
        <Root activeView={activeView}>
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
