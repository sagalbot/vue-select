export function useClickAway(callback: () => void) {
  let handler: ((event: Event) => void) | null = null

  function addClickAwayListener(el: HTMLElement | undefined) {
    if (!el) return

    handler = (event: Event) => {
      if (el && !(el === event.target || el.contains(event.target as Node))) {
        callback()
      }
    }

    document.addEventListener('click', handler)
  }

  function removeClickAwayListener(_el: HTMLElement | undefined) {
    if (handler) {
      document.removeEventListener('click', handler)
      handler = null
    }
  }

  return { addClickAwayListener, removeClickAwayListener }
}
