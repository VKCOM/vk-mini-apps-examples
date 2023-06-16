module.exports = {
  workbox: {
    method: 'inject',
    config: {
      swSrc: 'src/serviceWorker/service-worker.ts',
    },
  },
}
