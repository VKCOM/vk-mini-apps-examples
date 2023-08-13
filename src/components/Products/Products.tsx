import { FC, memo } from 'react'
import { Group, Header, Placeholder, Spinner } from '@vkontakte/vkui'
import { ProductCard } from 'src/components'
import { ProductPreview } from 'src/types'
import { selectOrderProducts } from 'src/store/shoppingCart.reducer'
import { useAppSelector } from 'src/store'

import './Products.css'

export type ProductsProps = {
  header: string
  fetching?: boolean
  maxProducts: number
  products: ProductPreview[]
}

let Products: FC<ProductsProps> = ({
  header,
  products,
  fetching,
  maxProducts,
}) => {
  const orderProducts = useAppSelector(selectOrderProducts)

  return (
    <Group className='Products'>
      <Header indicator={maxProducts} size="large">
        {header}
      </Header>
      <div className="Products_grid">
        {maxProducts > 0 &&
          products.map((item, index) => (
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
      {!maxProducts && !fetching && (
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
