import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import * as api from 'src/api'
import { NavIdProps, Panel } from '@vkontakte/vkui'
import { Filters, Navbar, PageHeader, Products } from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store'
import { addStoreProducts, setStoreScrollposition } from 'src/store/app'
import { useIntersectionObserver } from 'src/hooks'

import './Store.css'

const LIMIT = 10
const IMAGE_LOAD_DELAY = 500

function findImage(element: Element) {
  return element
    .getElementsByClassName('ProductCard_preview')[0]
    .getElementsByTagName('img')[0]
}

export const Store: React.FC<NavIdProps> = (props) => {
  const dispatch = useAppDispatch()
  const { store, filters, categories } = useAppSelector((state) => state.app)
  const [isFetching, setIsFetching] = useState(true)
  const [maxProducts, setMaxProducts] = useState(store.products.length)
  const [observerElements, setObserverElements] = useState<
    NodeListOf<Element> | Element[]
  >([])

  const lastLoadItemIndex = useRef<number>(LIMIT - 1)
  const $storeContainer = useRef<HTMLDivElement>(null)

  const { observer, entryElements } = useIntersectionObserver(
    observerElements,
    {
      root: $storeContainer.current,
      rootMargin: '0px 0px 300px 0px',
    },
    {
      findImage,
      delay: IMAGE_LOAD_DELAY,
    }
  )

  const fetchProducts = useCallback(
    (_start, _end) => {
      api.products.getProducts({ _start, _end, filters }).then((res) => {
        if (!res.products.length) {
          setIsFetching(false)
        }
        setMaxProducts(res.maxProducts)
        dispatch(addStoreProducts(res.products))
      })
    },
    [dispatch, filters]
  )

  useEffect(() => {
    entryElements.forEach((entry) => {
      // Элемент в зоне видимости
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        const itemIndex = Number(entry.target.getAttribute('data-index'))
        if (itemIndex === lastLoadItemIndex.current) {
          if (lastLoadItemIndex.current + 1 < maxProducts) {
            fetchProducts(
              lastLoadItemIndex.current + 1,
              lastLoadItemIndex.current + 1 + LIMIT
            )
            setIsFetching(true)
            lastLoadItemIndex.current += LIMIT
          } else setIsFetching(false)
        }
        observer?.unobserve(entry.target)
      }
    })
  }, [fetchProducts, maxProducts, observer, entryElements])

  useLayoutEffect(() => {
    if ($storeContainer.current && store.products.length)
      $storeContainer.current.scrollTop = store.scrollPosition
  }, [fetchProducts, store])

  useEffect(() => setIsFetching(true), [filters])

  useLayoutEffect(() => {
    if (!store.products.length && isFetching) fetchProducts(0, LIMIT)
  }, [fetchProducts, filters, store, isFetching])

  useEffect(() => {
    lastLoadItemIndex.current = store.products.length - 1
    setObserverElements(
      document.querySelectorAll('.ProductCard:not(.ProductCard__active)')
    )
  }, [store.products])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar
        searchValue={filters.query}
        header={<PageHeader header="Каталог" />}
      />
      <div
        ref={$storeContainer}
        className="Store_content"
        onScroll={(e) =>
          dispatch(setStoreScrollposition(e.currentTarget.scrollTop))
        }
      >
        <Products
          lazyLoading
          header="Товары"
          products={store.products}
          maxProducts={maxProducts}
          fetching={isFetching}
        />
        <Filters
          minPrice={1000}
          maxPrice={10000}
          defaultFilter={filters}
          categories={categories}
        />
      </div>
    </Panel>
  )
}
