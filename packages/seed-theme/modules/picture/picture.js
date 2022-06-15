import objectFitImages from 'object-fit-images'
require('intersection-observer')

export const loadSrc = (el, isVue = false) => {
  el.setAttribute('src', el.getAttribute('data-src'))
  el.removeAttribute('data-src')
}

export const loadSrcsets = (els, isVue = false) => {
  els.forEach(els => {
    els.setAttribute('srcset', els.getAttribute('data-srcset'))
    els.removeAttribute('data-srcset')
  })
}

export const initImageObserver = () => {
  const config = {
    threshold: 0
  }

  window.imageObserver = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.hasAttribute('data-src')) loadSrc(entry.target, true)

        const sourceEls = entry.target.parentNode.querySelectorAll('[data-srcset]')

        if (sourceEls) loadSrcsets(sourceEls, true)

        // Observer has been passed as self to our callback
        self.unobserve(entry.target)
      }
    })
  }, config)
}

export const observeNewImage = (el) => {
  window.imageObserver.observe(el)
}

export const init = (el, imgEl, sourceEls, isVue = false) => {
  // Check if native lazy-loading is supported, else use IntersectionObserver
  if ('loading' in HTMLImageElement.prototype) {
    loadSrc(imgEl, isVue)
    if (sourceEls) loadSrcsets(sourceEls, isVue)
  } else {
    // Init imageObserver as a global variable
    if (!window.imageObserver) initImageObserver()

    observeNewImage(imgEl)
  }

  imgEl.addEventListener('load', () => {
    el.isLoaded = true
    objectFitImages(imgEl)
  })
}

export default (el) => {
  const imgEl = el.querySelector('[data-src]')
  const sourceEls = el.querySelectorAll('[data-srcset]')

  if (imgEl) init(el, imgEl, sourceEls, false)
}
