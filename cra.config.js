module.exports = {
  workbox: {
    method: 'inject',
    config: {
      swSrc: 'src/service-worker.ts',
    },
  },
}
