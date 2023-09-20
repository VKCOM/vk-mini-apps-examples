export type IntersectionObserverOption = IntersectionObserverInit & {
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

  /** Имя аттрибута в котором хранится url картинки */
  attributeSourceName?: string

  findImage: (element: Element) => {
    image: HTMLImageElement
    source?: HTMLSourceElement[]
  }
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
  findImage: (element: Element) => {
    image: HTMLImageElement
    source?: HTMLSourceElement[]
  }
) => {
  const src = element.getAttribute(attributeName)
  const { image, source = [] } = findImage(element)
  if (image && src) {
    image.src = src
    image.complete
    source.forEach((item, index) => {
      const src = element.getAttribute(attributeName + `-${index + 1}`)
      if (src) item.srcset = src
    })
  }
}

/** Функция, запускающая таймер для загрузки изображения */
const delayLoad = (
  element: Element,
  delayTime: number,
  attributeName: string,
  findImage: (element: Element) => {
    image: HTMLImageElement
    source?: HTMLSourceElement[]
  }
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
 * Функция для создания IntersectionObserver с поддержкой ленивой загрузки фотографии по таймеру
 * @param initialObserverOptions - стандартные настройки для IntersectionObserver
 * @param imageLoadingOptions - настройки для ленивой загрузки фотографии
 * @returns IntersectionObserver
 */
export function imageIntersectionObserver(
  initialObserverOptions: IntersectionObserverOption,
  imageLoadingOptions: ImageLoadingOption
) {
  let firstLoad = true
  const { root, rootMargin, threshold, callback } = initialObserverOptions
  const { delay, attributeName, findImage } = imageLoadingOptions

  return new IntersectionObserver(
    (entries, observer) => {
      if (firstLoad) {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            loadAndUnobserve(entry.target, attributeName, findImage)
            callback(observer, entry)
          }
        })
        firstLoad = false
      } else {
        entries.forEach((entry) => {
          callback(observer, entry)
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            delayLoad(entry.target, delay, attributeName, findImage)
          } else cancelDelayLoad(entry.target)
        })
      }
    },
    { root, rootMargin, threshold }
  )
}
