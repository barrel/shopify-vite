import EmblaCarousel from 'embla-carousel'

class HeroSlider extends HTMLElement {
  constructor () {
    super()

    this.state = {}

    this.handleSlideFocusIn = this.handleSlideFocusIn.bind(this)
    this.resetScrollPosition = this.resetScrollPosition.bind(this)
    this.setup = this.setup.bind(this)
    this.teardown = this.teardown.bind(this)

    this.setup()

    this.parentElement.addEventListener('shopify:section:unload', () => {
      this.teardown()
    })
    this.parentElement.addEventListener('shopify:section:load', () => {
      this.setup()
    })
    this.parentElement.addEventListener('shopify:block:select', (event) => {
      console.log({ event, index: [...event.target.parentElement.children].indexOf(event.target) })
      this.embla.scrollTo([...event.target.parentElement.children].indexOf(event.target))
    })
  }

  setup () {
    if (this.querySelectorAll('[data-module="hero"]').length <= 1) {
      return
    }

    this.embla = EmblaCarousel(this, { loop: false })

    // Lock horizontal scroll for parent element
    this.parentElement.addEventListener('scroll', this.resetScrollPosition)

    // Jump to focused slide when moving with keyboard
    this.addEventListener('focusin', this.handleSlideFocusIn)

    if (this.state.selectedScrollSnap) {
      this.embla.scrollTo(this.state.selectedScrollSnap)
    }
  }

  teardown () {
    if (this.embla) {
      this.state.selectedScrollSnap = this.embla.selectedScrollSnap
      this.embla.destroy()
      this.parentElement.removeEventListener('scroll', this.handleSlideFocusIn)
      this.removeEventListener('focusin', this.handleSlideFocusIn)
    }
  }

  resetScrollPosition () {
    this.parentElement.scrollTo(0, 0)
  }

  handleSlideFocusIn (event) {
    const slide = event.target.closest('[data-module="hero"]')
    const slideIndex = parseInt(slide.getAttribute('data-slide-index'), 10) - 1

    this.embla.scrollTo(slideIndex, true)
  }
}

customElements.define('hero-slider', HeroSlider)
