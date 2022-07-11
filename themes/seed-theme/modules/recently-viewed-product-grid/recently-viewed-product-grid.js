import DynamicSectionElement from '@/scripts/dynamic-section-element'
import { getRecentlyViewed } from '../../frontend/scripts/recently-viewed'

class RecentlyViewedProductGrid extends DynamicSectionElement {
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

    const recentlyViewed = getRecentlyViewed()
    const query = recentlyViewed.map((handle) => `handle:${handle}`).join(' OR ')

    return fetch(`/search?view=product-grid&type=product&q=${query}`)
      .then((response) => response.text())
      .then((responseText) => {
        const newSectionEl = new DOMParser().parseFromString(responseText, 'text/html')
        this.replaceContent(newSectionEl)
      })
  }
}

customElements.define('recently-viewed-product-grid', RecentlyViewedProductGrid)

export default RecentlyViewedProductGrid
