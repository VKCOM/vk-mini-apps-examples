import { FC, memo } from 'react'
import {
  Group,
  Header,
  Placeholder,
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

let Products: FC<ProductsProps> = ({ products, fetching }) => {
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const orderProducts = useAppSelector(selectOrderProducts)
  const shopName = useAppSelector(selectShopName)
  const shopLogo = useAppSelector(selectShopLogo)

  return (
    <Group className="Products">
      {isDesktop && (
        <Header size="large">
          <div className="Products_header">
            <img
              className="Products_header_avatar"
              width={28}
              src={shopLogo}
              alt=""
            />
            <span>{shopName}</span>
          </div>
        </Header>
      )}
      <div className="Products_grid">
        {products.map((item, index) => (
          <ProductCard
            {...item}
            key={item.id}
            preview=""
            isInCart={orderProducts.some((product) => product.id === item.id)}
            data-index={index.toString()}
            data-src={item.preview + '.png'}
            data-src-1={item.preview + '.webp'}
          />
        ))}
      </div>
      {!products.length && !fetching && (
        <Placeholder>По твоему запросу ничего не нашлось</Placeholder>
      )}
      {fetching && (
        <div className="Products_spinner">
          <Spinner size="large"></Spinner>
        </div>
      )}
    </Group>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
Products = memo(Products)
export { Products }
