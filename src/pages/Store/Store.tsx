import { FC, memo, useLayoutEffect, useRef } from 'react'
import {
  NavIdProps,
  Panel,
  PanelHeader,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { CartCountIsland, Filters, Products, TechInfo } from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchFilteredProducts,
  selectStore,
  setStoreScrollposition,
} from 'src/store/store.reducer'
import { imageIntersectionObserver } from 'src/utils/imageIntersectionObserver'
import { selectFilters, selectShopName } from 'src/store/app.reducer'
import { ITEMS, SECTIONS } from './techConfig'
import { findImage } from 'src/utils'

import './Store.css'

const MOBILE_LIMIT = 12
const DESKTOP_LIMIT = 40
const IMAGE_LOAD_DELAY = 500

let Store: FC<NavIdProps> = (props) => {
  const dispatch = useAppDispatch()
  const store = useAppSelector(selectStore)
  const filters = useAppSelector(selectFilters)
  const shopName = useAppSelector(selectShopName)

  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const limit = isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT

  const scrollPosition = useRef(0)
  const isSavedContent = useRef(store.products.length > 0)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastLoadItemIndex = useRef(store.products.length || limit)
  const $storeContainer = useRef<HTMLDivElement>(null)

  const onHandleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    scrollPosition.current = e.currentTarget.scrollTop
  }

  /** Запрос на получение первых Limit элементов */
  useLayoutEffect(() => {
    const fetchProducts = (_start: number, _end: number) => {
      dispatch(fetchFilteredProducts({ _start, _end, filters }))
    }

    const onEntryCallback = (
      observer: IntersectionObserver,
      entry: IntersectionObserverEntry
    ) => {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        const itemIndex = Number(entry.target.getAttribute('data-index'))
        if (
          (itemIndex + 1) % limit === 0 &&
          itemIndex + 1 >= lastLoadItemIndex.current
        ) {
          fetchProducts(itemIndex + 1, itemIndex + 1 + limit)
          lastLoadItemIndex.current += limit
        }
      }
      if (entry.target.classList.contains('ProductCard__active')) {
        observer?.unobserve(entry.target)
      }
    }

    scrollPosition.current = 0
    observer.current?.disconnect()

    observer.current = imageIntersectionObserver(
      {
        root: $storeContainer,
        rootMargin: '0px 0px 150px 0px',
        callback: onEntryCallback,
      },
      {
        findImage,
        delay: IMAGE_LOAD_DELAY,
        attributeName: 'data-src',
      }
    )

    if (!isSavedContent.current) fetchProducts(0, limit)
    isSavedContent.current = false

    return () => {
      dispatch(setStoreScrollposition(scrollPosition.current))
    }
  }, [filters, limit, dispatch])

  /** Восстановление скролла */
  useLayoutEffect(() => {
    if (!$storeContainer.current) return
    $storeContainer.current.scrollTop = store.scrollPosition
    scrollPosition.current = store.scrollPosition

    lastLoadItemIndex.current = store.products.length || limit
    document
      .querySelectorAll('.ProductCard:not(.ProductCard__active)')
      .forEach((el) => {
        observer.current?.observe(el)
      })
  }, [store.scrollPosition, store.products, limit])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      {!isDesktop && (
        <>
          <PanelHeader separator={false}>{shopName}</PanelHeader>
          <Filters />
        </>
      )}

      <div ref={$storeContainer} className={'Store'} onScroll={onHandleScroll}>
        <Products products={store.products} fetching={store.isStoreFetching} />
        {isDesktop && (
          <div className="Store_sidebar">
            <CartCountIsland />
            <Filters />
            <TechInfo sections={SECTIONS} items={ITEMS} />
          </div>
        )}
      </div>
    </Panel>
  )
}

Store = memo(Store)
export { Store }
