export default {
  inheritAttrs: false,
  functional: true,
  props: {
    name: {
      type: String,
      required: true,
    },
    forceWrap: {
      type: Boolean,
      default: false,
    },
    context: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    var p = this.$parent;
    const { name, forceWrap, context, ...mergeWithContext } = this.$props;

    // Look up the ancestor tree for the first FormulateInput
    while (p && p.$options.name !== "FormulateInput") {
      p = p.$parent;
    }

    // if we never found the proper parent, just end it.
    if (!p) {
      return null;
    }

    // If we found a formulate input, check for a matching scoped slot
    if (p.$slots && p.$slots[name]) {
      return p.$slots[name]({ ...context, ...mergeWithContext });
    }
    // If we found no scoped slot, take the children and render those inside a wrapper if there are multiple
    if (
      Array.isArray(this.$slots.default()) &&
      (this.$slots.default().length > 1 ||
        (forceWrap && this.$slots.default().length > 0))
    ) {
      const { name, context, ...attrs } = this.$attrs;
      return h("div", { ...this.$attrs, ...attrs }, this.$slots.default());

      // If there is only one child, render it alone
    } else if (
      Array.isArray(this.$slots.default()) &&
      this.$slots.default().length === 1
    ) {
      return this.$slots.default()[0];
    }

    // If there are no children, render nothing
    return null;
  },
};
