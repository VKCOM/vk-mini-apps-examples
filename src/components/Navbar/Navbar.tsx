import React, { ReactNode, useCallback } from 'react'
import cx from 'classnames'
import { IconButton, Platform, Search, usePlatform } from '@vkontakte/vkui'
import { Icon28ShoppingCartOutline, Icon24Filter } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { PaymentPanel, StorePanelModal, ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'

import './Navbar.css'
import { setProductFilters } from '@/store/app'

export type NavbarProps = {
  header?: ReactNode
  filtersDisable?: boolean
  searchDisable?: boolean
}

let Navbar: React.FC<NavbarProps> = ({
  header,
  filtersDisable,
  searchDisable,
}) => {
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.app)
  const platfotm = usePlatform()

  const onSearchIconClick = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') return
      //dispatch(setProductFilters({...filters}))
      routeNavigator.push(`/${ViewingPanel.Store}`)
    },
    [routeNavigator]
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
        <Search className="Navbar_search" onKeyDown={onSearchIconClick} />

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
        </IconButton>
      </div>
    </div>
  )
}

Navbar = React.memo(Navbar)
export { Navbar }
