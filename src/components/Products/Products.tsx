import { FC, memo } from 'react'
import {
  Group,
  Header,
  Placeholder,
  Spacing,
  Spinner,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { ProductCard } from 'src/components'
import { ProductPreview } from 'src/types'
import { selectOrderProducts } from 'src/store/shoppingCart.reducer'
import { useAppSelector } from 'src/store'
import { selectShopLogo, selectShopName } from 'src/store/app.reducer'

import './Products.css'

export type ProductsProps = {
  fetching?: boolean
  products: ProductPreview[]
}

/** Блок для отображения сетки товаров */
export const Products: FC<ProductsProps> = memo(
  ({ products, fetching }: ProductsProps) => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries()
    const orderProducts = useAppSelector(selectOrderProducts)
    const shopName = useAppSelector(selectShopName)
    const shopLogo = useAppSelector(selectShopLogo)
    const lastIndex = products.length - 1

    const onAvatarLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const el = e.target as HTMLImageElement
      el.classList.remove('Products_header_avatar__unload')
    }

    return (
      <Group className="Products">
        {isDesktop && (
          <Header size="large">
            <div className="Products_header">
              <img
                className="Products_header_avatar Products_header_avatar__unload"
                width={28}
                height={28}
                src={shopLogo}
                onLoad={onAvatarLoad}
                alt=""
              />
              <span>{shopName}</span>
            </div>
            <Spacing size={8} />
          </Header>
        )}
        <div className="Products_grid">
          {products.map((item, index) => (
            <ProductCard
              {...item}
              key={item.id}
              preview={item.preview}
              isInCart={orderProducts.some(product => product.id === item.id)}
              data-last={index === lastIndex ? '1' : undefined}
              data-src={item.preview + '.png'}
              data-src-1={item.preview + '.webp'}
            />
          ))}
        </div>
        {!products.length && !fetching && (
          <Placeholder>По вашему запросу ничего не нашлось</Placeholder>
        )}
        {fetching && (
          <div className="Products_spinner">
            <Spinner size="large"></Spinner>
          </div>
        )}
      </Group>
    )
  }
)

Products.displayName = 'Products'
