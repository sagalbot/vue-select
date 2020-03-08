export default {
    inserted: function (el, bindings, vnode) {
        if (vnode.context.appendToBody) {
            let rect = vnode.context.$refs.toggle.getBoundingClientRect();
            el.style.width = rect.width + 'px';
            document.body.appendChild(el);
            vnode.context.calculatePosition(el, vnode);
        }
    },

    unbind: function (el, bindings, vnode) {
        if (vnode.context.appendToBody && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
}
