import EmblaCarousel from 'embla-carousel'

class AnnouncementBar extends HTMLElement {
  constructor () {
    super()

    this.resizeWindow = this.resizeWindow.bind(this)

    if (this.querySelectorAll('[data-announcement]').length > 1) {
      this.setup()
    }
  }

  setup () {
    this.embla = EmblaCarousel(this, { loop: true })
    this.embla.on('select', this.resizeWindow)

    this.resizeWindow()

    this.querySelector('[data-announcement-window]').classList.remove('hidden')
  }

  resizeWindow () {
    this.querySelector('[data-announcement-window]').setAttribute('style', `width: ${this.embla.slideNodes()[this.embla.selectedScrollSnap()].clientWidth}px`)
  }
}

customElements.define('announcement-bar', AnnouncementBar)
