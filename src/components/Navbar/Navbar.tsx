import React, { ReactNode, useCallback } from 'react'
import cx from 'classnames'
import {
  Counter,
  IconButton,
  Platform,
  Search,
  usePlatform,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { Icon28ShoppingCartOutline, Icon24Filter } from '@vkontakte/icons'
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { PaymentPanel, StorePanelModal, ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters } from 'src/store/app.reducer'
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme'

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
  const shoppingCart = useAppSelector((state) => state.shoppingCart)
  const platform = usePlatform()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
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

  const onShoppingCartIconClick = useCallback(() => {
    routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)
  }, [routeNavigator])

  return (
    <div
      className={cx({
        Navbar__mobile: platform !== Platform.VKCOM,
        Navbar__desktop: platform === Platform.VKCOM,
      })}
    >
      {children}
      {!searchDisable && (
        <div
          className={cx('Navbar_content', {
            Navbar_content__stretched: !children,
          })}
        >
          <Search
            defaultValue={searchValue}
            className="Navbar_search"
            onKeyDown={onInputKeyDown}
          />

          {!isDesktop && !filtersDisable && (
            <div className="Navbar_iconButton">
              <IconButton aria-label="filter" onClick={onFiltersIconClick}>
                <Icon24Filter
                  fill={baseTheme.colorPanelHeaderIcon.active.value}
                  height={28}
                  width={28}
                />
              </IconButton>
            </div>
          )}

          <div className="Navbar_iconButton">
            {shoppingCart.orderProducts.length > 0 && (
              <div className="Navbar_iconButton_counter">
                <Counter size="s" mode="prominent">
                  {shoppingCart.orderProducts.length}
                </Counter>
              </div>
            )}

            <IconButton onClick={onShoppingCartIconClick} aria-label="cart">
              <Icon28ShoppingCartOutline
                height={28}
                fill={baseTheme.colorPanelHeaderIcon.active.value}
                width={28}
              />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
Navbar = React.memo(Navbar)
export { Navbar }
