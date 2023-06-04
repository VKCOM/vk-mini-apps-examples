import React, { useCallback } from 'react'
import { Button, NavIdProps, Panel, Placeholder } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { Icon56UsersOutline } from '@vkontakte/icons'
import { CartItem, Navbar, PageHeader, Subtotal } from 'src/components'
import { PayConfirmPopout } from './PayConfirmPopout'
import { useAppSelector } from 'src/store'
import { INITIAL_URL } from 'src/routes'

import './ShoppingCart.css'

export const ShoppingCart: React.FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()
  const { orderProducts, totalPrice } = useAppSelector(
    (state) => state.app.shoppingCart
  )

  const isCartEmpty = orderProducts.length === 0

  const onPlaceholderClick = useCallback(() => {
    routeNavigator.replace(INITIAL_URL)
  }, [routeNavigator])

  const onConfirmPayClick = useCallback(() => {
    routeNavigator.showPopout(<PayConfirmPopout />)
  }, [routeNavigator])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchDisable header={<PageHeader header="Корзина" />} />
      <div className="ShoppingCart">
        <div className="ShoppingCart_productList">
          {orderProducts.map((item) => (
            <CartItem
              id={item.id}
              key={String(item.id)}
              name={item.name}
              price={item.price}
              preview={item.preview}
              maxAvailable={item.maxAvailable}
              productNumber={item.productNumber}
            />
          ))}

          {isCartEmpty && (
            <Placeholder
              header="Ваша корзина пока пуста"
              icon={<Icon56UsersOutline />}
              action={
                <Button onClick={onPlaceholderClick} size="m">
                  За покупками
                </Button>
              }
            >
              Наполните ее товарами
            </Placeholder>
          )}
        </div>

        <div className="ShoppingCart_checkout">
          <Subtotal totalPrice={totalPrice} />
          <div className="ShoppingCart_confirmPay">
            <Button
              stretched
              size="l"
              disabled={totalPrice === 0}
              onClick={onConfirmPayClick}
            >
              Купить
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  )
}
