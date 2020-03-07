const DROPDOWN_EDGE_MARGIN = 30

/**
 * An object that contains offset values of an element.
 * @typedef {Object} Offset
 * @property {number} top
 * @property {number} left
 * @property {number} maxHeight
*/

/**
 * Get an element offset relative to the window.
 *
 * @param {HTMLElement} element - element to calculate offset for.
 * @returns {Offset} element offset object.
 */
export function getOffset (element) {
  let el = element.offsetParent
  let parentEl = element.parentElement
  let top = element.offsetTop
  let left = element.offsetLeft
  let maxHeight

  while (parentEl) {
    if (el === parentEl) {
      top += el.offsetTop - el.scrollTop
      left += el.offsetLeft
      el = el.offsetParent
    } else {
      top -= parentEl.scrollTop
    }
    parentEl = parentEl.parentElement
  }

  if (typeof window === 'object') {
    maxHeight = window.innerHeight - top - DROPDOWN_EDGE_MARGIN
  }

  return {top, left, maxHeight}
}

/**
 * Positioning the dropdown list.
 * @param {HTMLElement} dropdownElement element for positioning.
 * @param {HTMLElement} baseElement element to positioning relative of
 * @param {string}      [aboveCssClass='above'] CSS class to apply
 * if target element should be positioning above the base element.
 */
export function positionDropdown (dropdownElement, baseElement, aboveCssClass = 'above') {
  const offset = baseElement && this.getOffset(baseElement)

  if (baseElement && dropdownElement) {
    const targetHeight = dropdownElement.offsetHeight

    // move it to the <body> to avoid glitches in IE
    if (dropdownElement.parentElement !== document.body) {
      document.body.appendChild(dropdownElement)
    }

    dropdownElement.style.minWidth = `${baseElement.offsetWidth}px`
    dropdownElement.style.left = `${offset.left}px`

    if (offset.maxHeight < targetHeight && offset.top > targetHeight / 2) {
      let top = offset.top - targetHeight + 1

      if (top < 0) {
        top = 0
        dropdownElement.style.maxHeight = `${offset.top}px`
      }
      dropdownElement.style.top = `${top}px`
      baseElement.classList.add(aboveCssClass)
      dropdownElement.classList.add(aboveCssClass)
    } else {
      if (offset.maxHeight < targetHeight) {
        dropdownElement.style.maxHeight = `${offset.maxHeight}px`
      }
      dropdownElement.style.top = `${offset.top + baseElement.offsetHeight - 1}px`
      baseElement.classList.remove(aboveCssClass)
      dropdownElement.classList.remove(aboveCssClass)
    }
  }
}

/**
 * Reset changes made by positionDropdown.
 * @param {HTMLElement} dropdownElement element for positioning.
 * @param {HTMLElement} baseElement element to positioning relative of
 * @param {string}      [aboveCssClass='above'] CSS class to apply
 * if target element should be positioning above the base element.
 */
export function resetDropdown(dropdownElement, targetElement, aboveCssClass = 'above') {
  targetElement.parentElement.appendChild(dropdownElement)
  dropdownElement.classList.remove(aboveCssClass)
  targetElement.classList.remove(aboveCssClass)
  dropdownElement.style.top = '';
  dropdownElement.style.left = '';
  dropdownElement.style.minWidth = '';
  dropdownElement.style.maxHeight = '';
}

/**
 * Get a scrollable elements that is parent of the target element.
 * @param {HTMLElement} targetElement.
 * @return {Array<HTMLElement>} array of scrollable DOM elements.
 */
export function getScrollableElements(targetElement) {
  const elements = []
  let el = targetElement.parentElement

  while (el && el.tagName !== 'HTML') {
    if (el.offsetHeight < el.scrollHeight) {
      elements.push(el)
    }
    el = el.parentElement
  }

  return elements
}
