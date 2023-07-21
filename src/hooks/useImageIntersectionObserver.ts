import { useEffect, useRef, useState } from 'react'

export type IntersectionObserverOption = Omit<
  IntersectionObserverInit,
  'root'
> & {
  root: React.RefObject<HTMLElement>
  callback: (
    observer: IntersectionObserver,
    entry: IntersectionObserverEntry
  ) => void
}

export type ImageLoadingOption = {
  /** Задержка в ms во время которой элемент должен находится в зоне видимости перед тем как начнется загрузка  */
  delay: number

  /** Имя аттрибута в котором хранится url картинки */
  attributeName: string

  /** Callback для поиска картинки в отслеживаемом элементе */
  findImage: (element: Element) => HTMLImageElement
}

/** Функция отмены ленивой загрузки изображения */
const cancelDelayLoad = (element: Element) => {
  const timeoutId = element.getAttribute('data-time')
  if (!timeoutId) return
  clearTimeout(Number(timeoutId))
  element.removeAttribute('data-time')
}

/** Функция, немедленно загружающая изображение */
const loadAndUnobserve = (
  element: Element,
  attributeName: string,
  findImage: (element: Element) => HTMLImageElement
) => {
  const src = element.getAttribute(attributeName)
  const img = findImage(element)
  if (img && src) img.src = src
}

/** Функция, запускающая таймер для загрузки изображения */
const delayLoad = (
  element: Element,
  delayTime: number,
  attributeName: string,
  findImage: (element: Element) => HTMLImageElement
) => {
  const timeoutId = element.getAttribute('data-time')
  if (timeoutId) return

  const newTimeoutId = setTimeout(function () {
    loadAndUnobserve(element, attributeName, findImage)
    cancelDelayLoad(element)
  }, delayTime)
  element.setAttribute('data-time', String(newTimeoutId))
}

/**
 * Хук для использования IntersectionObserver и поддержки ленивой прогрузки картинок
 * @param initialObserverOptions - настройки для IntersectionObserver
 * @param imageLoadingOptions - дополнительные настройки для ленивой загрузки фотографий
 * @returns callback для мгновенной звгрузки
 * @example 
 *  const { observer, entryElements } = useIntersectionObserver(
    {
      root: $storeContainer.current,
      rootMargin: '0px 0px 300px 0px',
    },
    {
      findImage: (el: Element) => el.getElementsByTagName('img')[0]),
      delay: IMAGE_LOAD_DELAY,
      attributeName: 'data-image'
    }
  )
 */
export function useImageIntersectionObserver(
  initialObserverOptions: IntersectionObserverOption,
  imageLoadingOptions: ImageLoadingOption
) {
  const [observer, setObserver] = useState<IntersectionObserver | null>(null)
  const isLoad = useRef(false)

  const { root, rootMargin, threshold, callback } = initialObserverOptions
  const { delay, attributeName, findImage } = imageLoadingOptions

  /** Инициализация/Обновление intersectionObserver */
  useEffect(() => {
    setObserver(
      new IntersectionObserver(
        (entries, observer) => {
          if (!isLoad.current) {
            entries.forEach((entry) => {
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                loadAndUnobserve(entry.target, attributeName, findImage)
              }
            })
            isLoad.current = true
          }

          entries.forEach((entry) => {
            callback(observer, entry)
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              // При попадании в зону видимости включаем таймер на ImageLoadingOption.delay
              // По окончании таймера картинка загружается
              delayLoad(entry.target, delay, attributeName, findImage)
              // Если элемент вышел из зоны загрузки, загрузка отменяется
            } else cancelDelayLoad(entry.target)
          })
        },
        { root: root.current, rootMargin, threshold }
      )
    )
  }, [root, rootMargin, threshold, delay, attributeName, findImage, callback])

  useEffect(() => {
    return () => setObserver(null)
  }, [])

  return { observer }
}
