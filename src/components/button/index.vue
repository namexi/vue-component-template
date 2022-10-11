<template>
  <button :class="classes" :type="nativeType" :disabled="disabled">
    <spinner v-if="loading && !disabled" :primary-color="loadingColor[type]" />
    <span><slot></slot></span>
    <ripple v-if="ripple" :color="rippleColor" />
    <slot name="upload"></slot>
  </button>
</template>

<script>
import Spinner from "../spinner";
import Ripple from "../ripple";

export default {
  name: "XButton",
  componentName: "XButton",
  props: {
    disabled: {
      type: Boolean,
    },
    type: {
      type: String,
      default: "default",
    },
    size: {
      type: String,
      default: "default",
    },
    nativeType: {
      type: String,
      default: "button",
    },
    plain: {
      type: Boolean,
    },
    loadingColor: {
      type: Object,
      default() {
        return {
          default: "#d6d6d6",
          danger: "#e04b00",
          warning: "#ff9900",
        };
      },
    },
    loading: {
      type: Boolean,
    },
    ripple: {
      type: Boolean,
    },
    round: {
      type: Boolean,
    },
    rippleColor: {
      type: String,
    },
    square: {
      type: Boolean,
    },
  },
  components: {
    Spinner,
    Ripple,
  },
  computed: {
    classes() {
      return [
        "vx-btn",
        "vx-btn--" + this.type,
        "vx-btn--size-" + this.size,
        {
          "is-plain": this.plain || this.type === "default",
          "is-ripple": this.ripple,
          "is-square": this.square,
          "is-round": this.round,
          "is-loading": this.loading,
          "is-disabled": this.disabled,
        },
      ];
    },
  },
};
</script>
