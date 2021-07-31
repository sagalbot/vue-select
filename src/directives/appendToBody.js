export default {
    /**
     * called when the bound element has been inserted into its parent node
     * (this only guarantees parent node presence, not necessarily in-document).
     * @see https://vuejs.org/v2/guide/custom-directive.html#Hook-Functions
     * @param el The element the directive is bound to. This can be used to directly manipulate the DOM.
     * @param bindings
     * @param context
     */
    inserted (el, bindings, {context}) {
        if (context.appendToBody) {
            const {height, top, left, width} = context.$refs.toggle.getBoundingClientRect();
            let scrollX = window.scrollX || window.pageXOffset;
            let scrollY = window.scrollY || window.pageYOffset;
            el.unbindPosition = context.calculatePosition(el, context, {
                width: width + 'px',
                left: (scrollX + left) + 'px',
                top: (scrollY + top + height) + 'px',
            });
            context.$emit('dropdown:appending', { el })
            document.body.appendChild(el);
        }
    },

    /**
     * called only once, when the directive is unbound from the element
     * @param el
     * @param bindings
     * @param context
     */
    unbind (el, bindings, {context}) {
        if (context.appendToBody) {
            if (el.unbindPosition && typeof el.unbindPosition === 'function') {
                el.unbindPosition();
            }
            if (el.parentNode) {
                context.$emit('dropdown:removing', { el })
                el.parentNode.removeChild(el);
            }
        }
    },
}
