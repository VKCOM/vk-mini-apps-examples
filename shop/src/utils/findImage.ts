/**
 * Функция для поиска img тега в ProductCard
 * @param element - ProductCard
 * @returns productCardpreview
 */
export function findImage(element: Element) {
  const picture = element
    .getElementsByClassName('ProductCard_preview')[0]
    .getElementsByTagName('picture')[0]
  const image = picture.getElementsByTagName('img')[0]
  const source = Array.from(picture.getElementsByTagName('source'))

  return { image, source }
}
