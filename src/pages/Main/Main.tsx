import React, { useCallback, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import {
  NavIdProps,
  Panel,
  Platform,
  useAdaptivityWithJSMediaQueries,
  usePlatform,
} from '@vkontakte/vkui'
import { Categories, Navbar, Products, TechInfo } from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters, appInitialState } from 'src/store/app.reducer'
import { setStore, storeInitialState } from 'src/store/store.reducer'
import { ITEMS, SECTIONS } from './techConfig'

import './Main.css'

let Main: React.FC<NavIdProps> = (props) => {
  const platfotm = usePlatform()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const dispatch = useAppDispatch()

  const shopInfo = useAppSelector((state) => state.app.shopInfo)
  const categories = useAppSelector((state) => state.app.categories)
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
      dispatch(setProductFilters(appInitialState.filters))
      dispatch(setStore(storeInitialState))
    }, 300)
  }, [dispatch])

  const MainHeader = useMemo(
    () => (
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
    ),
    [logoLoaded, platfotm, shopInfo.logo, shopInfo.name, onLogoLoad]
  )

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar filtersDisable>{MainHeader}</Navbar>

      <div className={cx('Main', { Main__desktop: isDesktop })}>
        <div
          className={cx('Main_sidebar', { Main_sidebar__desktop: isDesktop })}
        >
          <Categories categories={categories} />
          {isDesktop && <TechInfo sections={SECTIONS} items={ITEMS} />}
        </div>

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
