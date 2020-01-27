export default {
    inserted: function (el, bindings, vnode) {
        if (vnode.context.appendToBody) {
            let rect = vnode.context.$refs.toggle.getBoundingClientRect();

            el.style.width = rect.width + 'px';
            el.style.top = (window.scrollY + rect.top + rect.height) + 'px';
            el.style.left = (window.scrollX + rect.left) + 'px';
            el.style.zIndex = 1000000;
            document.body.appendChild(el);
        }
    },

    unbind: function (el, bindings, vnode) {
        if (vnode.context.appendToBody && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
}