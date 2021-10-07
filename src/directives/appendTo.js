export default {
  inserted(el, bindings, { context }) {
    const container =
      context.appendTo || context.appendToBody ? document.body : false

    if (container) {
      const {
        height,
        top,
        left,
        width,
      } = context.$refs.toggle.getBoundingClientRect()

      let scrollX = window.scrollX || window.pageXOffset
      let scrollY = window.scrollY || window.pageYOffset

      el.unbindPosition = context.calculatePosition(el, context, {
        width: width + 'px',
        left: scrollX + left + 'px',
        top: scrollY + top + height + 'px',
      })

      container.appendChild(el)
    }
  },

  unbind(el, bindings, { context }) {
    if (context.appendTo || context.appendToBody) {
      if (el.unbindPosition && typeof el.unbindPosition === 'function') {
        el.unbindPosition()
      }
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  },
}
