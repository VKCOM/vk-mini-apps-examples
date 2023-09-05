import { FC, useEffect, useMemo } from 'react'
import {
  useRouteNavigator,
  useSearchParams,
} from '@vkontakte/vk-mini-apps-router'
import {
  Div,
  FixedLayout,
  Gallery,
  IconButton,
  NavIdProps,
  Panel,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import {
  CustomPanelHeader,
  PriceDisplay,
  ProductPhoto,
  AddToCartButton,
  TechInfo,
} from 'src/components'
import { Icon24ShoppingCartOutline } from '@vkontakte/icons'
import { fetchProductInfo, selectProductInfo } from 'src/store/app.reducer'
import { selectOrderProducts } from 'src/store/shoppingCart.reducer'
import { useAppDispatch, useAppSelector } from 'src/store'
import { ITEMS, SECTIONS } from './techConfig'
import { ShopPanel } from 'src/routes'

import './ProductInfo.css'

export const ProductInfo: FC<NavIdProps> = (props) => {
  const dispatch = useAppDispatch()
  const routeNavigator = useRouteNavigator()
  const product = useAppSelector(selectProductInfo)
  const orderProducts = useAppSelector(selectOrderProducts)
  const [params] = useSearchParams()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()

  const productId = Number(params.get('id')) || product.id
  const price = Number(params.get('price')) || product.price
  const name = params.get('name') || product.name
  const back = params.get('back') || product.back
  const isProductFetched = productId === product.id

  const isInCart = useMemo(
    () => orderProducts.some((item) => item.id === productId),
    [orderProducts, productId]
  )

  /** Загружаем данные данные товара */
  useEffect(() => {
    if (!productId || isProductFetched) return
    dispatch(fetchProductInfo({ productId }))
  }, [isProductFetched, productId, dispatch])

  const shoppingCartIcon = useMemo(() => {
    return isDesktop ? (
      <IconButton
        aria-label='shoppinfCartIcon'
        onClick={() => routeNavigator.push(`/${ShopPanel.ShoppingCart}`)}
      >
        <Icon24ShoppingCartOutline />
      </IconButton>
    ) : undefined
  }, [routeNavigator, isDesktop])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <div className="ProductInfoPage">
        <CustomPanelHeader
          separator={false}
          after={shoppingCartIcon}
          title="Товар"
        />
        <div className="ProductInfo">
          <Gallery
            showArrows
            align="center"
            bullets="light"
            className="ProductInfo_gallery"
          >
            {!isProductFetched && (
              <div className={`ProductInfo_skeleton Back__${back}`} />
            )}
            {isProductFetched &&
              product.photos.map((photo, index) => (
                <ProductPhoto key={index} {...photo} />
              ))}
          </Gallery>

          <div className="ProductInfo_content">
            <div className="ProductInfo_content_title">{name}</div>
            <PriceDisplay price={price} className="ProductInfo_content_price" />
            <div className="ProductInfo_content_description">
              {isProductFetched ? product.description : ''}
            </div>
            {isDesktop && isProductFetched && (
              <AddToCartButton
                size="l"
                defaultMode="primary"
                product={product}
                isInCart={isInCart}
              />
            )}
          </div>

          {!isDesktop && (
            <FixedLayout filled vertical="bottom">
              <Div>
                <AddToCartButton
                  size="l"
                  stretched
                  defaultMode="primary"
                  product={product}
                  isInCart={isInCart}
                />
              </Div>
            </FixedLayout>
          )}
        </div>
        {isDesktop && <TechInfo sections={SECTIONS} items={ITEMS} />}
      </div>
    </Panel>
  )
}
