import { FC, memo, useCallback, useLayoutEffect, useRef } from 'react'
import {
  NavIdProps,
  Panel,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { Filters, Products, TechInfo } from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchFilteredProducts,
  setStoreScrollposition,
} from 'src/store/store.reducer'
import { useImageIntersectionObserver } from 'src/hooks'
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'
import { ViewingPanel } from 'src/routes'
import { ITEMS, SECTIONS } from './techConfig'

import './Store.css'

const MOBILE_LIMIT = 12
const DESKTOP_LIMIT = 40
const IMAGE_LOAD_DELAY = 500

/**
 * Функция для поиска img тега в ProductCard
 * @param element - ProductCard
 * @returns productCardpreview
 */
function findImage(element: Element) {
  const picture = element
    .getElementsByClassName('ProductCard_preview')[0]
    .getElementsByTagName('picture')[0]
  const image = picture.getElementsByTagName('img')[0]
  const source = Array.from(picture.getElementsByTagName('source'))

  return { image, source }
}

let Store: FC<NavIdProps> = (props) => {
  const dispatch = useAppDispatch()
  const { panel } = useActiveVkuiLocation()
  const store = useAppSelector((state) => state.store)
  const { filters, categories, shopInfo, shopFetching } = useAppSelector(
    (state) => state.app
  )
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
    if (panel !== ViewingPanel.Store) return
    document
      .querySelectorAll('.ProductCard__active')
      .forEach((el) => el.classList.remove('ProductCard__active'))

    if (!isSavedContent.current && !shopFetching)
      setTimeout(() => fetchProducts(0, limit), isFirstRender.current ? 150 : 0)
    isSavedContent.current = isFirstRender.current = false
  }, [panel, filters, shopFetching, limit, fetchProducts])

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

      <div ref={$storeContainer} className={'Store'} onScroll={onHandleScroll}>
        <Products
          lazyLoading
          header="Товары"
          products={store.products}
          maxProducts={store.filteredProductCount}
          fetching={store.isStoreFetching}
        />
        {isDesktop && (
          <div className="Store_sidebar">
            <Filters
              minPrice={shopInfo.minPrice}
              maxPrice={shopInfo.maxPrice}
              defaultFilter={filters}
              categories={categories}
            />
            <TechInfo sections={SECTIONS} items={ITEMS} />
          </div>
        )}
      </div>
    </Panel>
  )
}

Store = memo(Store)
export { Store }
