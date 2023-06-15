import React, { useEffect } from 'react'
import cx from 'classnames'
import { NavIdProps, Panel, Platform, usePlatform } from '@vkontakte/vkui'
import { Categories, Navbar, Products } from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters, initialState } from 'src/store/app'

import './Main.css'

let Main: React.FC<NavIdProps> = (props) => {
  const platfotm = usePlatform()
  const dispatch = useAppDispatch()

  const shopInfo = useAppSelector((state) => state.app.shopInfo)
  const categories = useAppSelector((state) => state.app.categories)
  const recomendedProducts = useAppSelector(
    (state) => state.app.recomendedProducts
  )

  useEffect(() => {
    dispatch(setProductFilters(initialState.filters))
  }, [dispatch])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar
        onInputResetFilters
        filtersDisable
        header={
          <div
            className={cx({
              Main_header__mobile: platfotm !== Platform.VKCOM,
              Main_header__desktop: platfotm === Platform.VKCOM,
            })}
          >
            <div className="Main_header_title">Моя страница</div>
            <div className="Main_header_shopInfo">
              <img src={shopInfo.logo} />
              <div className="Main_header_shopInfo_name">{shopInfo.name}</div>
            </div>
          </div>
        }
      />
      <div className="Main">
        <Categories categories={categories} />
        <Products
          maxProducts={recomendedProducts.length}
          header="Популярное"
          products={recomendedProducts}
          fetching={!recomendedProducts.length}
        />
      </div>
    </Panel>
  )
}

Main = React.memo(Main)
export { Main }
