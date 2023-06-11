import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { NavIdProps, Panel, Platform, usePlatform } from '@vkontakte/vkui'
import { Categories, Navbar, Products } from 'src/components'
import { useAppSelector, useAppDispatch } from 'src/store'
import { setCategories, setRecomendedProducts } from 'src/store/app'
import { getUserId } from 'src/utils'
import * as api from 'src/api'

import './Main.css'

export const Main: React.FC<NavIdProps> = (props) => {
  const platfotm = usePlatform()
  const dispatch = useAppDispatch()
  const [shopName, setShopName] = useState('')
  const [shopLogo, setShopLogo] = useState('')
  const [isFetching, setIsFetching] = useState(true)
  const { categories, recomendedProducts } = useAppSelector(
    (state) => state.app
  )

  useEffect(() => {
    api.user.get({ userId: Number(getUserId()) }).then((res) => {
      setShopLogo(res.storeInfo.logo)
      setShopName(res.storeInfo.name)
      setIsFetching(false)
      dispatch(setCategories(res.categories))
      dispatch(setRecomendedProducts(res.products))
    })
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
              <img src={shopLogo} />
              <div className="Main_header_shopInfo_name">{shopName}</div>
            </div>
          </div>
        }
      />
      <div className="Main">
        <Categories categories={categories} />
        <Products
          maxProducts={20}
          header="Популярное"
          products={recomendedProducts}
          fetching={isFetching}
        />
      </div>
    </Panel>
  )
}
