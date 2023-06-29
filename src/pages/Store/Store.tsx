import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { NavIdProps, Panel, Platform, usePlatform } from '@vkontakte/vkui'
import { Filters, Navbar, PageHeader, Products } from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchFilteredProducts, setStoreScrollposition } from 'src/store/app'
import { useIntersectionObserver } from 'src/hooks'
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'
import { ViewingPanel } from 'src/routes'

import './Store.css'

const LIMIT = 12
const IMAGE_LOAD_DELAY = 500

function findImage(element: Element) {
  return element
    .getElementsByClassName('ProductCard_preview')[0]
    .getElementsByTagName('img')[0]
}

export const Store: React.FC<NavIdProps> = (props) => {
  const dispatch = useAppDispatch()
  const { panel } = useActiveVkuiLocation()
  const { store, filters, categories, shopInfo } = useAppSelector(
    (state) => state.app
  )
  const platform = usePlatform()
  const [isFetching, setIsFetching] = useState(true)

  const lastLoadItemIndex = useRef<number>(LIMIT - 1)
  const scrollPosition = useRef(0)
  const isSavedContent = useRef(store.products.length > 0)
  const $storeContainer = useRef<HTMLDivElement>(null)

  const StoreHeader = useMemo(() => <PageHeader header="Каталог" />, [])

  const { observer, entryElements, immediatelyLoading } =
    useIntersectionObserver(
      {
        root: $storeContainer,
        rootMargin: '0px 0px 50px 0px',
      },
      {
        findImage,
        delay: IMAGE_LOAD_DELAY,
        attributeName: 'data-src',
      }
    )

  const fetchProducts = useCallback(
    (_start: number, _end: number) => {
      const onFetched = () => setIsFetching(false)
      dispatch(fetchFilteredProducts({ _start, _end, filters, onFetched }))
    },
    [dispatch, filters]
  )

  const onHandleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      scrollPosition.current = e.currentTarget.scrollTop
      console.log(scrollPosition.current, 'UPDATE')
    },
    []
  )

  /** Немедленно загружаем первые элементы в зоне видимости*/
  useLayoutEffect(() => {
    if (scrollPosition.current !== store.scrollPosition) return
    entryElements.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        immediatelyLoading(entry.target)
      }
    })
  }, [entryElements, store.scrollPosition, immediatelyLoading])

  /** Сканирование элементов в IntersectionObserver */
  useEffect(() => {
    entryElements.forEach((entry) => {
      // Элемент в зоне видимости
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        const itemIndex = Number(entry.target.getAttribute('data-index'))
        if (itemIndex === lastLoadItemIndex.current) {
          if (lastLoadItemIndex.current + 1 < store.filteredProductCount) {
            fetchProducts(
              lastLoadItemIndex.current + 1,
              lastLoadItemIndex.current + 1 + LIMIT
            )
            lastLoadItemIndex.current += LIMIT
          }
        }
      }
      if (entry.target.classList.contains('ProductCard__active')) {
        observer?.unobserve(entry.target)
      }
    })
  }, [fetchProducts, store.filteredProductCount, observer, entryElements])

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

    if (!isSavedContent.current) fetchProducts(0, LIMIT)
    isSavedContent.current = false
  }, [filters, panel, fetchProducts])

  /** Следим за новыми элементами при загрузке новой партии продуктов */
  useLayoutEffect(() => {
    lastLoadItemIndex.current = store.products.length - 1
    document
      .querySelectorAll('.ProductCard:not(.ProductCard__active)')
      .forEach((el) => {
        observer?.observe(el)
      })
  }, [store, observer])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchValue={''}>{StoreHeader}</Navbar>

      <div
        ref={$storeContainer}
        className="Store_content"
        onScroll={onHandleScroll}
      >
        <Products
          lazyLoading
          header="Товары"
          products={store.products}
          maxProducts={store.filteredProductCount}
          fetching={isFetching}
        />
        {platform === Platform.VKCOM && (
          <Filters
            minPrice={shopInfo.minPrice}
            maxPrice={shopInfo.maxPrice}
            defaultFilter={filters}
            categories={categories}
          />
        )}
      </div>
    </Panel>
  )
}
