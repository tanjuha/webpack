function createAnalytics (): object {
  let counter = 0
  let isDestroy: boolean = false;

  const listener = (): number => counter++
  document.addEventListener('click', listener)

  return {
    destroy() {
      document.removeEventListener('click', listener)
      isDestroy = true;
    },
    getClicks() {
      if(isDestroy) {
        return 'Analytics is destroyed :( test'
      }
      return counter;
    }
  }
}

window['analytics'] = createAnalytics()