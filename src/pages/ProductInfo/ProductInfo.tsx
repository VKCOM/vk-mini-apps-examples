import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import cx from 'classnames'
import {
  useRouteNavigator,
  useSearchParams,
} from '@vkontakte/vk-mini-apps-router'
import { Button, Gallery, NavIdProps, Panel, Separator } from '@vkontakte/vkui'
import {
  Counter,
  Navbar,
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

export const ProductInfo: React.FC<NavIdProps> = (props) => {
  const dispatch = useAppDispatch()
  const routeNavigator = useRouteNavigator()
  const [isProductInCart, setIsProductInCart] = useState(false)
  const [productInfo, setProductInfo] = useState<Product | null>(null)
  const [productNumber, setProductNumber] = useState(1)
  const [isScroll, setIsScroll] = useState(false)
  const [params] = useSearchParams()

  const $content = useRef<HTMLDivElement>(null)
  const id = params.get('id')

  const { orderProducts } = useAppSelector((state) => state.shoppingCart)

  const addToShoppingCart = useCallback(() => {
    if (productInfo && !isProductInCart)
      dispatch(addCartItem({ ...productInfo, productNumber }))
    else routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)
  }, [dispatch, productNumber, productInfo, isProductInCart, routeNavigator])

  // Получаем данные о товаре
  useEffect(() => {
    if (!id) return
    api.products
      .getProductInfo({ productId: Number(id) })
      .then((res) => setProductInfo(res.product))
  }, [id])

  // Следим появляется ли у нас скролл
  useLayoutEffect(() => {
    if ($content.current)
      setIsScroll($content.current.clientHeight < $content.current.scrollHeight)
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
      <div ref={$content} className="ProductInfo">
        <Gallery
          showArrows
          align="center"
          bullets="light"
          className="ProductInfo_gallery"
        >
          {productInfo?.photos.map((photo, index) => (
            <ProductPhoto key={index} photo={photo} />
          ))}
        </Gallery>

        {!productInfo && (
          <div className="ProductInfo_gallery ProductInfo_skeleton" />
        )}

        <div className="ProductInfo_offer">
          <div className="ProductInfo_offer_title">{productInfo?.name}</div>
          {!productInfo && (
            <div
              style={{ display: 'block' }}
              className="ProductInfo_offer_price__skeleton"
            />
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
            ProductInfo_footer__scroll: isScroll,
          })}
        >
          <Button stretched size="l" mode="primary" onClick={addToShoppingCart}>
            {!isProductInCart ? 'В корзину' : 'Посмотреть в корзине'}
          </Button>

          {!isProductInCart && (
            <Counter
              value={productNumber}
              maxValue={productInfo?.maxAvailable ?? 1}
              onAdd={() => setProductNumber((value) => value + 1)}
              onSubtract={() => setProductNumber((value) => value - 1)}
            />
          )}
        </div>
      </div>
    </Panel>
  )
}
