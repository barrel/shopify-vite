class CollectionFilters extends HTMLElement {
  // Update filters with new content from re-rendered section
  update (newCollectionFiltersEl) {
    // Store active element ID in case it is replaced during update
    const activeElementId = document.activeElement?.id

    // Pull "details" elements representing filters from re-rendered markup
    const newFilters = newCollectionFiltersEl.querySelectorAll('details')

    // Replace each filter's contents individually to preserve opened/closed state
    this.querySelectorAll('details').forEach((el, index) => {
      el.innerHTML = newFilters[index].innerHTML
    })

    // Replace footer content showing active filters state
    this.querySelector('footer').innerHTML = newCollectionFiltersEl.querySelector('footer').innerHTML

    // Restore focus to original active element
    if (activeElementId) {
      document.getElementById(activeElementId).focus()
    }
  }
}

customElements.define('collection-filters', CollectionFilters)
