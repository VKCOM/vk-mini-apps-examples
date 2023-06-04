import React, { useEffect } from 'react'
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
  const { categories, recomendedProducts } = useAppSelector(
    (state) => state.app
  )

  useEffect(() => {
    api.user.get({ userId: Number(getUserId()) }).then((res) => {
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
              <img src="https://avatars.mds.yandex.net/i?id=5fec9dfd920adb8a6c7b380d1680ba41a033fb59-9234023-images-thumbs&n=13" />
              <div className="Main_header_shopInfo_name">CRUNCH</div>
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
          fetching={!recomendedProducts.length}
        />
      </div>
    </Panel>
  )
}
