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
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { PaymentPanel, StorePanelModal, ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters } from 'src/store/app'

import './Navbar.css'

export type NavbarProps = {
  header?: ReactNode
  searchValue?: string
  filtersDisable?: boolean
  searchDisable?: boolean
  onInputResetFilters?: boolean
}

let Navbar: React.FC<NavbarProps> = ({
  header,
  filtersDisable,
  searchDisable,
  searchValue,
  onInputResetFilters,
}) => {
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()
  const { filters, shoppingCart } = useAppSelector((state) => state.app)
  const platfotm = usePlatform()

  const onSearchIconClick = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter' || !('value' in e.target)) return
      if (onInputResetFilters)
        dispatch(
          setProductFilters({
            ...filters,
            categoryId: '',
            query: e.target.value as string,
          })
        )
      else
        dispatch(
          setProductFilters({
            ...filters,
            query: e.target.value as string,
          })
        )
      routeNavigator.push(`/${ViewingPanel.Store}`)
    },
    [routeNavigator, dispatch, filters, onInputResetFilters]
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
      {header}
      <div
        className={cx('Navbar_content', {
          Navbar_content__stretched: !header,
          Navbar_content__disabled: searchDisable,
        })}
      >
        <Search
          defaultValue={searchValue}
          className="Navbar_search"
          onKeyDown={onSearchIconClick}
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
