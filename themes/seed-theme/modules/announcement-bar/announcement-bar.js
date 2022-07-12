import EmblaCarousel from 'embla-carousel'

class AnnouncementBar extends HTMLElement {
  constructor () {
    super()

    this.onSelectSlide = this.onSelectSlide.bind(this)

    if (this.querySelectorAll('[data-announcement]').length > 1) {
      this.setup()
    }
  }

  setup () {
    this.querySelectorAll('[data-announcement]').forEach((el) => el.classList.remove('hidden'))
    this.querySelector('[data-announcement-mask]').classList.remove('hidden')

    this.embla = EmblaCarousel(this)

    this.embla.on('select', this.onSelectSlide)
    window.addEventListener('resize', this.onSelectSlide)

    this.onSelectSlide()
  }

  onSelectSlide () {
    if (this.embla.canScrollPrev()) {
      this.querySelector('button[name="prev"]').removeAttribute('disabled')
    } else {
      this.querySelector('button[name="prev"]').setAttribute('disabled', true)
    }

    if (this.embla.canScrollNext()) {
      this.querySelector('button[name="next"]').removeAttribute('disabled')
    } else {
      this.querySelector('button[name="next"]').setAttribute('disabled', true)
    }

    const selectedSlideNode = this.embla.slideNodes()[this.embla.selectedScrollSnap()]

    this.querySelector('[data-announcement-mask]').setAttribute('style', `width: ${selectedSlideNode.clientWidth}px`)
  }
}

customElements.define('announcement-bar', AnnouncementBar)
