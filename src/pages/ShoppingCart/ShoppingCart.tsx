import { FC, memo, useCallback } from 'react'
import {
  Button,
  Card,
  NavIdProps,
  Panel,
  Placeholder,
  Separator,
  Spacing,
} from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Icon28ShoppingCartOutline } from '@vkontakte/icons'
import { CartItem, CustomPanelHeader, Subtotal } from 'src/components'
import { PayConfirmPopout } from './PayConfirmPopout'
import { useAppSelector } from 'src/store'
import { INITIAL_URL } from 'src/routes'
import { selectShoppingCart } from 'src/store/shoppingCart.reducer'

import './ShoppingCart.css'

let ShoppingCart: FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()
  const { orderProducts, totalPrice } = useAppSelector(selectShoppingCart)
  const isCartEmpty = orderProducts.length === 0

  const onPlaceholderClick = useCallback(() => {
    routeNavigator.replace(INITIAL_URL)
  }, [routeNavigator])

  const onConfirmPayClick = useCallback(() => {
    routeNavigator.showPopout(<PayConfirmPopout />)
  }, [routeNavigator])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <CustomPanelHeader title="Товар" />
      <div className="ShoppingCart">
        <div className="ShoppingCart_productList">
          {orderProducts.map((item) => (
            <div style={{ width: '100%' }} key={String(item.id)}>
              <CartItem {...item} />
              <Spacing size={20}>
                <Separator />
              </Spacing>
            </div>
          ))}

          {isCartEmpty && (
            <Placeholder
              header="Ваша корзина пока пуста"
              icon={<Icon28ShoppingCartOutline width={56} height={56} />}
              action={
                <Button mode="secondary" onClick={onPlaceholderClick} size="m">
                  За покупками
                </Button>
              }
            />
          )}
        </div>

        <div className="ShoppingCart_checkout">
          <Card>
            <Subtotal totalPrice={totalPrice} />
          </Card>
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

ShoppingCart = memo(ShoppingCart)

export { ShoppingCart }
