import React, { useCallback } from 'react'
import {
  Button,
  Card,
  NavIdProps,
  Panel,
  Placeholder,
  Platform,
  usePlatform,
} from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Icon56UsersOutline } from '@vkontakte/icons'
import { CartItem, Navbar, PageHeader, Subtotal } from 'src/components'
import { PayConfirmPopout } from './PayConfirmPopout'
import { useAppSelector } from 'src/store'
import { INITIAL_URL } from 'src/routes'

import './ShoppingCart.css'

let ShoppingCart: React.FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()
  const platform = usePlatform()
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
            />
          )}
        </div>

        <div className="ShoppingCart_checkout">
          {platform === Platform.VKCOM && <Subtotal totalPrice={totalPrice} />}
          {platform !== Platform.VKCOM && (
            <Card>
              <Subtotal totalPrice={totalPrice} />
            </Card>
          )}
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

ShoppingCart = React.memo(ShoppingCart)

export { ShoppingCart }
