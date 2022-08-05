class SliderDots extends HTMLElement {
  constructor () {
    super()

    this.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-active')) {
        event.target.dispatchEvent(new CustomEvent('change-slide', {
          detail: { index: [...this.children].indexOf(event.target) },
          bubbles: true
        }))
      }
    })
  }

  updateActiveDot (index) {
    this.querySelectorAll('[data-active]').forEach((dot) => {
      dot.setAttribute('data-active', false)
    })
    this.querySelector(`[data-active]:nth-child(${index + 1})`).setAttribute('data-active', true)
  }
}

customElements.define('slider-dots', SliderDots)
