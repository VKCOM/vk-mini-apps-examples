import React from 'react'
import { Button, NavIdProps, Panel } from '@vkontakte/vkui'
import { CartItem, Navbar, PageHeader, Subtotal } from 'src/components'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { PayConfirmPopout } from './PayConfirmPopout'
import { SHOPPING_CART_ITEM_TEST } from 'src/config'

import './ShoppingCart.css'

export const ShoppingCart: React.FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchDisable header={<PageHeader header="Корзина" />} />
      <div className="ShoppingCart">
        <div className="ShoppingCart_productList">
          {SHOPPING_CART_ITEM_TEST.map((item) => (
            <CartItem
              id={item.id}
              productName={item.productName}
              price={item.price}
              key={String(item.id)}
              preview={item.preview}
            />
          ))}
        </div>

        <div className="ShoppingCart_checkout">
          <Subtotal />
          <div className="ShoppingCart_confirmPay">
            <Button
              onClick={() => {
                routeNavigator.showPopout(<PayConfirmPopout />)
              }}
              stretched
              size="l"
            >
              Купить
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  )
}
