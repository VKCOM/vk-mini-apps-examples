/** Получение параметров из url запроса */
export function getParams(url: string) {
  const queryParams = url.split('?')[1]
  if (!queryParams) return {}
  return JSON.parse(
    '{"' + queryParams.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    function (key, value) {
      return key === '' ? value : decodeURIComponent(value)
    }
  )
}
