import {
  FC,
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react'
import cx from 'classnames'
import {
  useSearchParams,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { Button, Gallery, NavIdProps, Panel, Separator } from '@vkontakte/vkui'
import {
  Navbar,
  Counter,
  PageHeader,
  PriceDisplay,
  ProductPhoto,
} from 'src/components'
import { addCartItem } from 'src/store/shoppingCart.reducer'
import { useAppDispatch, useAppSelector } from 'src/store'
import { PaymentPanel } from 'src/routes'
import { Product } from 'src/types'
import * as api from 'src/api'

import './ProductInfo.css'

export const ProductInfo: FC<NavIdProps> = (props) => {
  // Получаем функцию для отправки данных в store
  const dispatch = useAppDispatch()
  // Получаем объект для навигации по приложению
  const routeNavigator = useRouteNavigator()
  // Получаем параметры из url
  const [params] = useSearchParams()
  const [isProductInCart, setIsProductInCart] = useState(false)
  const [productInfo, setProductInfo] = useState<Product | null>(null)
  const [numItemsToBuy, setNumItemsToBuy] = useState(1)
  const [isScrollPresent, setIsScrollPresent] = useState(false)

  const $productInfoContent = useRef<HTMLDivElement>(null)

  // Вытаскиваем параметр id из параметров url
  const id = params.get('id')

  const { orderProducts } = useAppSelector((state) => state.shoppingCart)
  const shopFetching = useAppSelector((state) => state.app.shopFetching)

  const addToShoppingCart = useCallback(() => {
    if (productInfo && !isProductInCart)
      dispatch(addCartItem({ ...productInfo, numItemsToBuy }))
    else routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)
  }, [dispatch, numItemsToBuy, productInfo, isProductInCart, routeNavigator])

  // Получаем данные о товаре
  useEffect(() => {
    if (!id || shopFetching) return
    api.products
      .getProductInfo({ productId: Number(id) })
      .then((res) => setProductInfo(res.product))
  }, [id, shopFetching])

  // Следим появляется ли у нас скролл
  useLayoutEffect(() => {
    const productContent = $productInfoContent.current
    if (productContent)
      setIsScrollPresent(
        productContent.clientHeight < productContent.scrollHeight
      )
  }, [productInfo])

  // Находится ли карта в корзине
  useLayoutEffect(() => {
    if (!id) return
    setIsProductInCart(orderProducts.some((item) => item.id === Number(id)))
  }, [orderProducts, id])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchDisable>
        <PageHeader header="Товар" />
      </Navbar>
      <div ref={$productInfoContent} className="ProductInfo">
        <Gallery
          showArrows
          align="center"
          bullets="light"
          className="ProductInfo_gallery"
        >
          {productInfo?.photos.map((photo, index) => (
            <ProductPhoto key={index} {...photo} />
          ))}
        </Gallery>

        {!productInfo && (
          <div className="ProductInfo_gallery ProductInfo_skeleton" />
        )}

        <div className="ProductInfo_offer">
          <div className="ProductInfo_offer_title">{productInfo?.name}</div>
          {!productInfo && (
            <div className="ProductInfo_offer_price__skeleton" />
          )}
          {productInfo && (
            <PriceDisplay
              price={productInfo.price}
              className="ProductInfo_offer_price"
            />
          )}
          {!productInfo && (
            <div className="ProductInfo_offer_price__skeleton" />
          )}
        </div>

        <Separator />

        <div className="ProductInfo_description">
          {productInfo?.description}
        </div>

        <div
          className={cx('ProductInfo_footer', {
            ProductInfo_footer__scroll: isScrollPresent,
          })}
        >
          <Button stretched size="l" mode="primary" onClick={addToShoppingCart}>
            {!isProductInCart ? 'В корзину' : 'Посмотреть в корзине'}
          </Button>

          {!isProductInCart && (
            <Counter
              value={numItemsToBuy}
              maxValue={productInfo?.maxAvailable ?? 1}
              onAdd={() => setNumItemsToBuy((value) => value + 1)}
              onSubtract={() => setNumItemsToBuy((value) => value - 1)}
            />
          )}
        </div>
      </div>
    </Panel>
  )
}
