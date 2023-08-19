import { FC, memo, useCallback } from 'react'
import {
  Button,
  Header,
  NavIdProps,
  Panel,
  Placeholder,
  Separator,
  Spacing,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Icon28ShoppingCartOutline } from '@vkontakte/icons'
import { CartItem, CustomPanelHeader, Checkout, TechInfo } from 'src/components'
import { PayConfirmPopout } from './PayConfirmPopout'
import { useAppSelector } from 'src/store'
import { INITIAL_URL } from 'src/routes'
import { selectShoppingCart } from 'src/store/shoppingCart.reducer'
import { formatWordByNumber } from 'src/utils'
import { selectShopName } from 'src/store/app.reducer'
import { ITEMS, SECTIONS } from './techConfig'

import './ShoppingCart.css'

let ShoppingCart: FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const { orderProducts, totalPrice } = useAppSelector(selectShoppingCart)
  const shopName = useAppSelector(selectShopName)
  const isCartEmpty = orderProducts.length === 0
  const productNumber = orderProducts.length
  const subtitle = `${productNumber} ${formatWordByNumber(
    productNumber,
    'товар',
    'товара',
    'товаров'
  )}`
  const title = isDesktop && productNumber ? 'Корзина ' + subtitle : shopName

  const onPlaceholderClick = useCallback(() => {
    routeNavigator.replace(INITIAL_URL)
  }, [routeNavigator])

  const onConfirmPayClick = useCallback(() => {
    routeNavigator.showPopout(<PayConfirmPopout />)
  }, [routeNavigator])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <CustomPanelHeader separator={false} title={title} />
      <div className="ShoppingCart">
        {!isDesktop && !!productNumber && (
          <Header size="large">{subtitle}</Header>
        )}
        <div className="ShoppingCart_productList">
          {orderProducts.map((item) => (
            <div style={{ width: '100%' }} key={String(item.id)}>
              <CartItem {...item} />
              <Spacing size={20}>
                <Separator wide />
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
        <div className="Sidebar">
          <Checkout
            onConfirmPayClick={onConfirmPayClick}
            totalPrice={totalPrice}
          />
          {isDesktop && (
            <TechInfo
              mode="accent"
              sections={SECTIONS}
              items={ITEMS}
            />
          )}
        </div>
      </div>
    </Panel>
  )
}

ShoppingCart = memo(ShoppingCart)

export { ShoppingCart }
