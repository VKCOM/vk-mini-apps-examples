/**
 * Функция берет из адресной строки приложения id пользователя в Vk
 * @returns userId
 */
export const getUserId = () => {
  return (
    window.location.search.split('vk_user_id=')[1]?.split('&')[0] ||
    window.location.search.split('viewer_id=')[1]?.split('&')[0]
  )
}
