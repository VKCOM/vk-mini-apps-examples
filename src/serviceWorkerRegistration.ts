type Config = {
  /** Callback на успешную установку service-worker */
  onSuccess?: (registration: ServiceWorkerRegistration) => void

  /** Callback на успешную обновление */
  onUpdate?: (registration: ServiceWorkerRegistration) => void
}

// Здесь мы проверяем, есть ли поддержка Service Worker в браузере, используя проверку 'serviceWorker' in navigator.
// Если эта проверка успешна, то это означает, что SW можно установить. В таком случае, мы вызываем функцию registerValidSW()
export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      return
    }

    const swUrl = '/service-worker.js'
    registerValidSW(swUrl, config)
    navigator.serviceWorker.ready.then(() => {
      console.log(
        'This web app is being served cache-first by a service worker'
      )
    })
  }
}

/** Регестрируем SW вызываем & callback функции & выводим в логи результат */
function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              console.log('Content is cached for offline use.')

              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error)
    })
}

/** Функция для удаления сервисного работника */
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
