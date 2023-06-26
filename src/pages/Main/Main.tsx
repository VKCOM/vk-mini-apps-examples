import React, { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import {
  NavIdProps,
  Panel,
  Platform,
  Spinner,
  usePlatform,
} from '@vkontakte/vkui'
import { Categories, Navbar, Products } from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters, initialState, setStore } from 'src/store/app'

import './Main.css'

let Main: React.FC<NavIdProps> = (props) => {
  const platfotm = usePlatform()
  const dispatch = useAppDispatch()

  const shopInfo = useAppSelector((state) => state.app.shopInfo)
  const categories = useAppSelector((state) => state.app.categories)
  const shopFetching = useAppSelector((state) => state.app.shopFetching)
  const [logoLoaded, setLogoLoaded] = useState(false)

  const recomendedProducts = useAppSelector(
    (state) => state.app.recomendedProducts
  )

  const onLogoLoad = useCallback(() => {
    setLogoLoaded(true)
  }, [])

  /** Возвращаем начальное состояние фильтров и сохраненных товаров */
  useEffect(() => {
    setTimeout(() => {
      dispatch(setProductFilters(initialState.filters))
      dispatch(setStore(initialState.store))
    }, 300)
  }, [dispatch])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar
        filtersDisable
        header={
          <div
            className={cx({
              Main_header__mobile: platfotm !== Platform.VKCOM,
              Main_header__desktop: platfotm === Platform.VKCOM,
            })}
          >
            <div className="Main_header_title">Моя страница</div>
            <div
              className={cx('Main_header_shopInfo', {
                Main_header_shopInfo__unload: !logoLoaded,
              })}
            >
              <img src={shopInfo.logo} onLoad={onLogoLoad} />
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
      {shopFetching && <Spinner />}
    </Panel>
  )
}

Main = React.memo(Main)
export { Main }
