export default {
    inserted (el, bindings, {context}) {
        if (context.appendToBody) {
            const {height, top, left} = context.$refs.toggle.getBoundingClientRect();

            el.unbindPosition = context.calculatePosition(el, context, {
                width: context.$refs.toggle.clientWidth + 'px',
                top: (window.scrollY + top + height) + 'px',
                left: (window.scrollX + left) + 'px',
            });

            document.body.appendChild(el);
        }
    },

    unbind (el, bindings, {context}) {
        if (context.appendToBody) {
            if (el.unbindPosition && typeof el.unbindPosition === 'function') {
                el.unbindPosition();
            }
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    },
}
