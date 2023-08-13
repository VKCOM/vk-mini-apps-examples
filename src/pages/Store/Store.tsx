import { FC, memo, useCallback, useLayoutEffect, useRef } from 'react'
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
import { selectFilters } from 'src/store/app.reducer'
import { useImageIntersectionObserver } from 'src/hooks'
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

  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const limit = isDesktop ? DESKTOP_LIMIT : MOBILE_LIMIT

  const scrollPosition = useRef(0)
  const isSavedContent = useRef(store.products.length > 0)
  const isFirstRender = useRef(true)
  const $storeContainer = useRef<HTMLDivElement>(null)
  const lastLoadItemIndex = useRef(store.products.length || limit)

  const fetchProducts = useCallback(
    (_start: number, _end: number) => {
      dispatch(fetchFilteredProducts({ _start, _end, filters }))
    },
    [filters, dispatch]
  )

  const onEntryCallback = useCallback(
    (observer: IntersectionObserver, entry: IntersectionObserverEntry) => {
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
    },
    [fetchProducts, limit]
  )

  const { observer } = useImageIntersectionObserver(
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

  const onHandleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      scrollPosition.current = e.currentTarget.scrollTop
    },
    []
  )

  /** Обнуление скролла при начале загрузки и сохранение скролла при unmount */
  useLayoutEffect(() => {
    scrollPosition.current = 0
    return () => {
      dispatch(setStoreScrollposition(scrollPosition.current))
    }
  }, [filters, dispatch])

  /** Scroll restoration */
  useLayoutEffect(() => {
    if (!$storeContainer.current) return
    $storeContainer.current.scrollTop = store.scrollPosition
    scrollPosition.current = store.scrollPosition
  }, [store.scrollPosition])

  /** Запрос на получение первых Limit элементов */
  useLayoutEffect(() => {
    document
      .querySelectorAll('.ProductCard__active')
      .forEach((el) => el.classList.remove('ProductCard__active'))

    if (!isSavedContent.current)
      setTimeout(() => fetchProducts(0, limit), isFirstRender.current ? 150 : 0)
    isSavedContent.current = isFirstRender.current = false
  }, [filters, limit, fetchProducts])

  /** Следим за новыми элементами при загрузке новой партии продуктов */
  useLayoutEffect(() => {
    lastLoadItemIndex.current = store.products.length || limit
    document
      .querySelectorAll('.ProductCard:not(.ProductCard__active)')
      .forEach((el) => {
        observer?.observe(el)
      })
  }, [store, observer, limit])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      {!isDesktop && (
        <>
          <PanelHeader separator={false}>Название магазина</PanelHeader>
          <Filters />
        </>
      )}

      <div ref={$storeContainer} className={'Store'} onScroll={onHandleScroll}>
        <Products
          header="Товары"
          products={store.products}
          maxProducts={store.filteredProductCount}
          fetching={store.isStoreFetching}
        />
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
