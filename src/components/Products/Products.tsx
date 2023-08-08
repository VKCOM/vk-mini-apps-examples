import { FC, memo } from 'react'
import { Header, Placeholder, Spinner } from '@vkontakte/vkui'
import { ProductCard } from 'src/components'
import { ProductPreview } from 'src/types'
import { useAppSelector } from 'src/store'

import './Products.css'

export type ProductsProps = {
  header: string
  fetching?: boolean
  maxProducts: number
  lazyLoading?: boolean
  products: ProductPreview[]
}

let Products: FC<ProductsProps> = ({
  header,
  products,
  fetching,
  maxProducts,
  lazyLoading,
}) => {
  const { orderProducts } = useAppSelector((state) => state.shoppingCart)

  return (
    <div className={'Products'}>
      <Header indicator={maxProducts} size="large">
        {header}
      </Header>
      <div className="Products_grid">
        {maxProducts > 0 &&
          products.map((item, index) => (
            <ProductCard
              {...item}
              key={item.id}
              preview={lazyLoading ? '' : item.preview}
              isInCart={orderProducts.some((product) => product.id === item.id)}
              data-index={`${lazyLoading ? index : null}`}
              data-src={`${lazyLoading ? item.preview + '.png' : null}`}
              data-src-1={`${lazyLoading ? item.preview + '.webp' : null}`}
            />
          ))}
      </div>
      {!maxProducts && !fetching && (
        <Placeholder>По твоему запросу ничего не нашлось</Placeholder>
      )}
      {fetching && lazyLoading && (
        <div className="Products_spinner">
          <Spinner size="large"></Spinner>
        </div>
      )}
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
Products = memo(Products)
export { Products }
