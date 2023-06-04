import React from 'react'
import { Header, Placeholder, Spinner } from '@vkontakte/vkui'
import { ProductCard } from 'src/components'
import { ProductPreview } from 'src/types'
import { Icon56HelpOutline } from '@vkontakte/icons'

import './Products.css'

export type ProductsProps = {
  products: ProductPreview[]
  header: string
  maxProducts: number
  lazyLoading?: boolean
  fetching?: boolean
}

let Products: React.FC<ProductsProps> = ({
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
        {maxProducts &&
          products.map((item, index) => {
            return (
              <ProductCard
                id={item.id}
                key={item.id}
                name={item.name}
                price={item.price}
                productType={item.productType}
                preview={lazyLoading ? '' : item.preview}
                data-index={`${lazyLoading ? index : null}`}
                data-src={`${lazyLoading ? item.preview : null}`}
              />
            )
          })}
        {!maxProducts && !fetching && (
          <Placeholder icon={<Icon56HelpOutline />}>
            По твоему запросу ничего не нашлось
          </Placeholder>
        )}
      </div>
      {fetching && (
        <div className="Products_spinner">
          <Spinner size="large" />
        </div>
      )}
    </div>
  )
}

Products = React.memo(Products)
export { Products }
