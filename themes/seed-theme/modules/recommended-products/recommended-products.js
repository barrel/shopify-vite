import DynamicSectionElement from '@/scripts/dynamic-section-element'

class RecommendedProducts extends DynamicSectionElement {
  constructor () {
    super()

    this.onScrollIntoView = this.onScrollIntoView.bind(this)

    this.state = {
      loaded: false
    }

    const observer = new IntersectionObserver(this.onScrollIntoView)
    observer.observe(this)
  }

  onScrollIntoView (entries) {
    if (!entries[0].isIntersecting || this.state.loaded) {
      return
    }

    this.state.loaded = true

    return fetch(this.dataset.url)
      .then((response) => response.text())
      .then((responseText) => {
        const newSectionEl = new DOMParser().parseFromString(responseText, 'text/html')
        this.replaceContent(newSectionEl)
        this.querySelector('.hidden').classList.remove('hidden')
      })
  }
}

customElements.define('recommended-products', RecommendedProducts)

export default RecommendedProducts
