import React, { ReactNode, useCallback } from 'react'
import cx from 'classnames'
import {
  Counter,
  IconButton,
  Platform,
  Search,
  usePlatform,
} from '@vkontakte/vkui'
import { Icon28ShoppingCartOutline, Icon24Filter } from '@vkontakte/icons'
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { PaymentPanel, StorePanelModal, ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters } from 'src/store/app'

import './Navbar.css'

export type NavbarProps = {
  children?: ReactNode
  searchValue?: string
  filtersDisable?: boolean
  searchDisable?: boolean
  onInputResetFilters?: boolean
}

let Navbar: React.FC<NavbarProps> = ({
  filtersDisable,
  searchDisable,
  searchValue,
  children,
}) => {
  const routeNavigator = useRouteNavigator()
  const filters = useAppSelector((state) => state.app.filters)
  const shoppingCart = useAppSelector((state) => state.app.shoppingCart)
  const platfotm = usePlatform()
  const { panel } = useActiveVkuiLocation()

  const dispatch = useAppDispatch()

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter' || !('value' in e.target)) return
      dispatch(
        setProductFilters({
          ...filters,
          query: e.target.value as string,
        })
      )
      if (panel !== ViewingPanel.Store)
        routeNavigator.push(`/${ViewingPanel.Store}`)
    },
    [routeNavigator, filters, panel, dispatch]
  )

  const onFiltersIconClick = useCallback(() => {
    routeNavigator.push(`/${ViewingPanel.Store}/${StorePanelModal.Filters}`)
  }, [routeNavigator])

  return (
    <div
      className={cx({
        Navbar__mobile: platfotm !== Platform.VKCOM,
        Navbar__desktop: platfotm === Platform.VKCOM,
      })}
    >
      {children}
      <div
        className={cx('Navbar_content', {
          Navbar_content__stretched: !children,
          Navbar_content__disabled: searchDisable,
        })}
      >
        <Search
          defaultValue={searchValue}
          className="Navbar_search"
          onKeyDown={onInputKeyDown}
        />

        <IconButton
          aria-label="filter"
          className={cx('Navbar_iconButton', {
            Navbar_iconButton__disabled: filtersDisable,
          })}
          onClick={onFiltersIconClick}
        >
          <Icon24Filter width={28} fill="2688EB" />
        </IconButton>

        <IconButton aria-label="cart" className="Navbar_iconButton">
          <Icon28ShoppingCartOutline
            onClick={() => routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)}
            fill="2688EB"
          />
          {shoppingCart.orderProducts.length > 0 && (
            <Counter
              className="Navbar_iconButton_counter"
              size="s"
              mode="prominent"
            >
              {shoppingCart.orderProducts.length}
            </Counter>
          )}
        </IconButton>
      </div>
    </div>
  )
}

Navbar = React.memo(Navbar)
export { Navbar }
