import { useEffect, useRef, useState } from 'react'

export type ImageLoadingOption = {
  /** Callback для поиска картинки в отслеживаемом элементе */
  delay: number

  /** Задержка в ms во время которой элемент должен находится в зоне видимости перед тем как начнется загрузка  */
  findImage: (element: Element) => HTMLImageElement
}

/** Функция отмены ленивой загрузки изображения */
const cancelDelayLoad = (element: Element) => {
  const timeoutId = element.getAttribute('data-time')
  if (!timeoutId) return
  clearTimeout(timeoutId)
  element.removeAttribute('data-time')
}

/** Функция, немедленно загружающая изображение */
const loadAndUnobserve = (
  element: Element,
  findImage: (element: Element) => HTMLImageElement
) => {
  const src = element.getAttribute('data-src')
  const img = findImage(element)
  if (img && src) img.src = src
}

/** Функция, запускающая таймер для загрузки изображения */
const delayLoad = (
  element: Element,
  delayTime: number,
  findImage: (element: Element) => HTMLImageElement
) => {
  const timeoutId = element.getAttribute('data-time')
  if (timeoutId) return

  const newTimeoutId = setTimeout(function () {
    loadAndUnobserve(element, findImage)
    cancelDelayLoad(element)
  }, delayTime)
  element.setAttribute('data-time', String(newTimeoutId))
}

/**
 * Хук для использования IntersectionObserver и поддержки ленивой прогрузки картинок
 * @param observableElements - список элементов за которыми необходимо следить при скролле
 * @param options - настройки для IntersectionObserver
 * @param imageLoadingOptions - дополнительные настройки для ленивой загрузки фотографий
 * @returns список entry(отслеживаемых элементов) и ссылку на обработчик
 * @example 
 *  const { observer, entryElements } = useIntersectionObserver(
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
 */
export const useIntersectionObserver = (
  observableElements: Element[] | NodeListOf<Element>,
  options?: IntersectionObserverInit,
  imageLoadingOptions?: ImageLoadingOption
) => {
  const observer = useRef<IntersectionObserver | null>(null)
  const [entryElements, setEntryElements] = useState<
    IntersectionObserverEntry[]
  >([])

  /** Инициализация/Обновление intersectionObserver */
  useEffect(() => {
    observer.current = new IntersectionObserver((entries, observer) => {
      setEntryElements(entries)
      if (!imageLoadingOptions) return

      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          delayLoad(
            entry.target,
            imageLoadingOptions.delay,
            imageLoadingOptions.findImage
          )
          observer.unobserve(entry.target)
        } else cancelDelayLoad(entry.target)
      })
    }, options)
  }, [options, imageLoadingOptions])

  /** Запуск слежения за кждым из полученных элементов */
  useEffect(() => {
    observer.current?.disconnect()
    observableElements.forEach((item) => observer.current?.observe(item))
  }, [observableElements])

  return { entryElements, observer: observer.current }
}
