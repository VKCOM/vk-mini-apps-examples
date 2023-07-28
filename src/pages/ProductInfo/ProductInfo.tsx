import { FC, useRef, useState, useEffect, useLayoutEffect } from 'react'
import {
  useSearchParams,
  useActiveVkuiLocation,
} from '@vkontakte/vk-mini-apps-router'
import {
  Gallery,
  NavIdProps,
  Panel,
  Platform,
  Separator,
  usePlatform,
} from '@vkontakte/vkui'
import { Navbar, PageHeader, PriceDisplay, ProductPhoto } from 'src/components'
import { fetchProductInfo } from 'src/store/productInfo.reducer'
import { useAppDispatch, useAppSelector } from 'src/store'
import { ViewingPanel } from 'src/routes'
import { ProductInfoFooter } from './ProductIndoFooter'

import './ProductInfo.css'

export const ProductInfo: FC<NavIdProps> = (props) => {
  // Получаем функцию для отправки данных в store
  const dispatch = useAppDispatch()
  // Активная панель
  const { panel } = useActiveVkuiLocation()
  // Текущая платформа IOS ANDROID VKCOM
  const platform = usePlatform()
  // Получаем параметры из url
  const [params] = useSearchParams()

  const [isScrollPresent, setIsScrollPresent] = useState(false)
  const $productInfoContent = useRef<HTMLDivElement>(null)

  // Вытаскиваем параметр id из параметров url
  const productId = Number(params.get('id'))

  // Подписываемся на обновления из store
  const shopFetching = useAppSelector((state) => state.app.shopFetching)
  const product = useAppSelector((state) => state.productInfo)

  const isProductFetched =
    productId === product.id || panel !== ViewingPanel.ProductInfo

  // Отправляем запрос на получение данный о товаре
  useLayoutEffect(() => {
    if (!productId || shopFetching) return
    if (isProductFetched) return
    console.log('categoryId: [5]')
    // Для платформы ANDROID отправляем запрос с задержкой для поддержки плавности анимаций
    setTimeout(
      () => dispatch(fetchProductInfo({ productId })),
      platform === Platform.ANDROID ? 200 : 0
    )
  }, [isProductFetched, productId, shopFetching, platform, dispatch])

  // Проверка наличия скролла на страницу
  useEffect(() => {
    const productContent = $productInfoContent.current
    if (productContent)
      setIsScrollPresent(
        productContent.clientHeight < productContent.scrollHeight
      )
  }, [isProductFetched])

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
          {isProductFetched &&
            product.photos.map((photo, index) => (
              <ProductPhoto key={index} {...photo} />
            ))}
        </Gallery>

        {!isProductFetched && (
          <div className="ProductInfo_gallery ProductInfo_skeleton" />
        )}

        <div className="ProductInfo_offer">
          {isProductFetched && (
            <>
              <div className="ProductInfo_offer_title">{product.name}</div>
              <PriceDisplay
                price={product.price}
                className="ProductInfo_offer_price"
              />
            </>
          )}

          {!isProductFetched && (
            <>
              <div className="ProductInfo_offer_price__skeleton" />
              <div className="ProductInfo_offer_price__skeleton" />
            </>
          )}
        </div>

        <Separator />

        {isProductFetched && (
          <div className="ProductInfo_description">{product.description}</div>
        )}

        <ProductInfoFooter
          isProductFetched={isProductFetched}
          product={product}
          productId={productId}
          isScrollPresent={isScrollPresent}
        />
      </div>
    </Panel>
  )
}
