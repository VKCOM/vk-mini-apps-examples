import React, { useCallback } from 'react'
import {
  Button,
  Card,
  NavIdProps,
  Panel,
  Placeholder,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Icon56UsersOutline } from '@vkontakte/icons'
import { CartItem, Navbar, PageHeader, Subtotal } from 'src/components'
import { PayConfirmPopout } from './PayConfirmPopout'
import { useAppSelector } from 'src/store'
import { INITIAL_URL } from 'src/routes'
import cx from 'classnames'

import './ShoppingCart.css'

let ShoppingCart: React.FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const { orderProducts, totalPrice } = useAppSelector(
    (state) => state.shoppingCart
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
      <Navbar searchDisable>
        <PageHeader header="Корзина" />
      </Navbar>

      <div
        className={cx('ShoppingCart', {
          ShoppingCart__desktop: isDesktop,
        })}
      >
        <div
          className={cx('ShoppingCart_productList', {
            ShoppingCart_productList__desktop: isDesktop,
          })}
        >
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

        <div
          className={cx('ShoppingCart_checkout', {
            ShoppingCart_checkout__desktop: isDesktop,
          })}
        >
          {isDesktop && <Subtotal totalPrice={totalPrice} />}
          {!isDesktop && (
            <Card>
              <Subtotal totalPrice={totalPrice} />
            </Card>
          )}
          <div
            className={cx('ShoppingCart_confirmPay', {
              ShoppingCart_confirmPay__desktop: isDesktop,
            })}
          >
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
