const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

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

    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js'

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config)

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker'
          )
        })
      } else {
        registerValidSW(swUrl, config)
      }
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
              console.log(
                'New content is available and will be used when all tabs'
              )

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

/** Проверка наличия работующего service-worker и установка в случае отсутствия */
function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type')
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
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
