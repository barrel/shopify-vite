import './hero-slider.css'

import EmblaCarousel from 'embla-carousel'

class HeroSlider extends HTMLElement {
  constructor () {
    super()

    this.handleSlideFocusIn = this.handleSlideFocusIn.bind(this)

    this.setup()
  }

  setup () {
    if (this.querySelectorAll('[data-module="hero"]').length < 1) {
      return
    }

    this.embla = EmblaCarousel(this, { loop: false })

    // Lock horizontal scroll for parent element
    this.parentElement.addEventListener('scroll', (event) => {
      this.parentElement.scrollTo(0, 0)
    })

    // Jump to focused slide when moving with keyboard
    this.addEventListener('focusin', this.handleSlideFocusIn)
  }

  teardown () {
    this.embla.destroy()
    this.removeEventListener('focusin', this.handleSlideFocusIn)
  }

  handleSlideFocusIn (event) {
    const slide = event.target.closest('[data-module="hero"]')
    const slideIndex = parseInt(slide.getAttribute('data-slide-index'), 10) - 1

    this.embla.scrollTo(slideIndex, true)
  }
}

customElements.define('hero-slider', HeroSlider)
