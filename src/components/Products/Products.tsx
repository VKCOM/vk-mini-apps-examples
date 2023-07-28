import { FC, memo } from 'react'
import { Header, Placeholder, Spinner } from '@vkontakte/vkui'
import { ProductCard } from 'src/components'
import { ProductPreview } from 'src/types'

import './Products.css'

export type ProductsProps = {
  products: ProductPreview[]
  header: string
  maxProducts: number
  lazyLoading?: boolean
  fetching?: boolean
}

let Products: FC<ProductsProps> = ({
  products,
  header,
  maxProducts,
  lazyLoading,
  fetching,
}) => {
  return (
    <div className={'Products'}>
      <Header indicator={maxProducts} size="large">
        {header}
      </Header>
      <div className="Products_grid">
        {maxProducts > 0 &&
          products.map((item, index) => (
            <ProductCard
              id={item.id}
              key={item.id}
              name={item.name}
              price={item.price}
              preview={lazyLoading ? '' : item.preview}
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
