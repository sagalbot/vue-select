export default {
    inserted: function (el, bindings, vnode) {
        if (vnode.context.appendToBody) {
            let rect = vnode.context.$refs.toggle.getBoundingClientRect();
            el.style.width = rect.width + 'px';
            vnode.context.calculatePosition(el, vnode);
            document.body.appendChild(el);
        }
    },

    unbind: function (el, bindings, vnode) {
        if (vnode.context.appendToBody && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
}
