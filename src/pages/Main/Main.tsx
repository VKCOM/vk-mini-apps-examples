import React from 'react'
import cx from 'classnames'
import { Categories, Navbar, Products } from 'src/components'
import { NavIdProps, Panel, Platform, usePlatform } from '@vkontakte/vkui'
import { CATEGORIES_TEST, PRODUCTS_TEST } from 'src/config'

import './Main.css'

export const Main: React.FC<NavIdProps> = (props) => {
  const platfotm = usePlatform()

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
            <div className="Main_header_title">Каталог товаров</div>
            <div className="Main_header_shopInfo">
              <img src="https://avatars.mds.yandex.net/i?id=5fec9dfd920adb8a6c7b380d1680ba41a033fb59-9234023-images-thumbs&n=13" />
              <div className="Main_header_shopInfo_name">CRUNCH</div>
            </div>
          </div>
        }
      />
      <div className="Main">
        <Categories categories={CATEGORIES_TEST} />
        <Products
          maxProducts={20}
          header="Популярное"
          products={PRODUCTS_TEST}
        />
      </div>
    </Panel>
  )
}
