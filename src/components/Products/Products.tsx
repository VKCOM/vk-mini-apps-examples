import React from 'react'
import { Header, Spinner } from '@vkontakte/vkui'
import { ProductCard, ProductCardProps } from '../ProductCard/ProductCard'

import './Products.css'

export type ProductsProps = {
  products: Array<ProductCardProps & { id: number }>
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
        {products.map((item, index) => {
          return (
            <ProductCard
              key={item.id}
              price={item.price}
              productType={item.productType}
              name={item.name}
              preview={lazyLoading ? '' : item.preview}
              data-index={`${lazyLoading ? index : null}`}
              data-src={`${lazyLoading ? item.preview : null}`}
            />
          )
        })}
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
