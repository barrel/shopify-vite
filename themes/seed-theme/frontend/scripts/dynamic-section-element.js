/**
 * Enable parts of an element to be replaced with newly-rendered content from Section Rendering API
 */
class DynamicSectionElement extends HTMLElement {
  // Return the name of the current module, used to request a new instance of the section
  get name () {
    return this.tagName.toLowerCase()
  }

  // Re-render the section for this module using a specified target URL (e.g. pagination or filter link)
  loadSectionFromUrl (url = '', options = {}) {
    // Replace current URL in browser history if required
    if (options.replaceState) {
      window.history.replaceState(null, null, url)
    }

    // Store active element ID in case it is replaced during update
    // const activeElementId = document.activeElement?.id

    // Load new HTML for this module's section from Section Rendering API
    return fetch(`${url}&sections=${this.name}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const newSectionEl = new DOMParser()
          .parseFromString(responseJson[this.name], 'text/html')

        // Replace contents new HTML
        this.replaceContent(newSectionEl, options)

        // Restore focus to original active element if the ID still exists
        // if (activeElementId && activeElementId !== document.activeElement?.id) {
        //   document.getElementById(activeElementId)?.focus()
        // }
      })
  }

  // Replace content marked with "data-slot" attributes inside current element
  replaceContent (newEl, options = {}) {
    if (this.dataset.slot) {
      // If parent element has data-slot attribute, replace entire contents
      this.innerHTML = newEl.querySelector(`[data-slot="${this.dataset.slot}"]`).innerHTML
      return
    }

    // Find all descendant elements with data-slot attribute and update each with new contents
    const oldSlots = this.querySelectorAll('[data-slot]')

    oldSlots.forEach((oldSlotEl) => {
      const slotName = oldSlotEl.dataset.slot

      if (options.appendToSlots?.length && options.appendToSlots.includes(slotName)) {
        // Append content to designated slots
        const newSlotEl = newEl.querySelector(`[data-slot="${slotName}"]`)
        oldSlotEl.insertAdjacentHTML(
          'beforeend',
          newSlotEl.innerHTML
        )
      } else {
        // Replace original content with new slot elements
        oldSlotEl.innerHTML = newEl.querySelector(`[data-slot="${slotName}"]`).innerHTML
      }
    })
  }
}

export default DynamicSectionElement
