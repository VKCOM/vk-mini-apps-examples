import React, { useEffect, useLayoutEffect } from 'react'
import { SplitLayout, SplitCol, View, Root } from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import {
  useActiveVkuiLocation,
  usePopout,
  useRouteNavigator,
} from '@vkontakte/vk-mini-app-router'
import { Modals } from './modals'
import { Main, Store, CategoryList, ShoppingCart, ProductInfo } from './pages'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOnboardingComplete, setUserName } from 'src/store/user'
import { PaymentPanel, ShopView, ViewingPanel } from './routes'
import { getUserId } from './utils/getUserId'

const App = (): JSX.Element => {
  const routerPopout = usePopout()
  const routeNavigator = useRouteNavigator()
  const { panel = ViewingPanel.Main, view = ShopView.Viewing } =
    useActiveVkuiLocation()

  const { onboadrdingComplete } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

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
          user_id: Number(getUserId()),
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
  }, [dispatch])

  /** Открытие модалки при первом заходе в апп */
  useEffect(() => {
    if (!onboadrdingComplete) {
      routeNavigator.showModal('onboarding')
    }
  }, [onboadrdingComplete, routeNavigator])

  return (
    <SplitLayout popout={routerPopout} modal={<Modals />}>
      <SplitCol>
        <Root activeView={view}>
          <View nav={ShopView.Viewing} activePanel={panel}>
            <Main nav={ViewingPanel.Main} />
            <Store nav={ViewingPanel.Store} />
            <CategoryList nav={ViewingPanel.CategoryList} />
            <ProductInfo nav={ViewingPanel.ProductInfo} />
          </View>

          <View nav={ShopView.Payment} activePanel={panel}>
            <ShoppingCart nav={PaymentPanel.ShoppingCart} />
          </View>
        </Root>
      </SplitCol>
    </SplitLayout>
  )
}

export { App }
