import Button from "./button";

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    setTimeout;
}

let components = [Button];

const install = (Vue) => {
  components.map((component) => {
    if (component && component.componentName) {
      Vue.component(component.componentName, component);
    }
  });
  Vue.prototype.$toast = (_props, mounted = document.body) => {
    let props = Object.assign(
      {
        open: true,
        onClose: () => {
          return true;
        },
      },
      _props
    );
    let node = document.createElement("div");
    mounted.appendChild(node);
    let vue = new Vue({
      //eslint-disable-line
      el: node,
      render(createElement) {
        let message = props.message;
        return createElement(Toast, {
          props: props,
          on: {
            close: this.handleClose,
            "after-close": this.handleAfterClose,
          },
          scopedSlots: {
            default: (props) =>
              createElement("div", { domProps: { innerHTML: message } }),
          },
        });
      },
      data() {
        return {
          props,
        };
      },
      methods: {
        handleClose() {
          props.open = props.onClose() === false;
        },
        handleAfterClose() {
          this.$destroy();
        },
      },
      beforeDestroy() {
        vue.$el.parentNode && vue.$el.parentNode.removeChild(vue.$el);
      },
    });
    return vue;
  };

  Vue.prototype.$alert = (_props, mounted = document.body) => {
    return new Promise((resolve, reject) => {
      let props = Object.assign(
        {
          open: false,
          onConfirm: () => {
            return true;
          },
          onCancel: () => {
            return true;
          },
        },
        _props
      );
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = new Vue({
        //eslint-disable-line
        el: node,
        render(createElement) {
          let message = props.message;
          return createElement(Alert, {
            props: props,
            on: {
              confirm: this.handleConfirm,
              close: this.handleClose,
              "after-close": this.handleAfterClose,
            },
            scopedSlots: {
              default: (props) =>
                createElement("div", { domProps: { innerHTML: message } }),
            },
          });
        },
        data() {
          return {
            props,
          };
        },
        mounted() {
          props.open = true;
        },
        methods: {
          handleConfirm() {
            resolve();
            props.open = props.onConfirm() === false;
          },
          handleClose() {
            reject();
            props.open = props.onCancel() === false;
          },
          handleAfterClose() {
            vue.$destroy();
          },
        },
        beforeDestroy() {
          vue.$el.parentNode.removeChild(vue.$el);
        },
      });
    });
  };

  Vue.prototype.$confirm = (_props, mounted = document.body) => {
    return new Promise((resolve, reject) => {
      let props = Object.assign(
        {
          open: false,
          onConfirm: () => {
            return true;
          },
          onCancel: () => {
            return true;
          },
        },
        _props
      );
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = new Vue({
        //eslint-disable-line
        el: node,
        render(createElement) {
          let message = props.message;
          return createElement(Confirm, {
            props: props,
            on: {
              confirm: this.handleConfirm,
              close: this.handleClose,
              "after-close": this.handleAfterClose,
              "button-click": this.handleButtonClick,
            },
            scopedSlots: {
              default: (props) =>
                createElement("div", { domProps: { innerHTML: message } }),
            },
          });
        },
        data() {
          return {
            props,
          };
        },
        mounted() {
          props.open = true;
        },
        methods: {
          handleConfirm() {
            resolve();
            props.open = props.onConfirm() === false;
          },
          handleClose() {
            reject();
            props.open = props.onCancel() === false;
          },
          handleAfterClose() {
            this.$destroy();
          },
          handleButtonClick(event) {
            props.onButtonClick && props.onButtonClick(event);
          },
        },
        beforeDestroy() {
          vue.$el.parentNode.removeChild(vue.$el);
        },
      });
    });
  };
  Vue.prototype.$prompt = (_props, mounted = document.body) => {
    return new Promise((resolve, reject) => {
      let props = Object.assign(
        {
          open: false,
          disabled: true,
          onConfirm: () => {
            return true;
          },
          onCancel: () => {
            return true;
          },
          onChange: (value) => {
            if (value && value.trim()) {
              return false;
            } else {
              return true;
            }
          },
        },
        _props
      );
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = new Vue({
        //eslint-disable-line
        el: node,
        render(createElement) {
          return createElement(Prompt, {
            props: props,
            on: {
              confirm: this.handleConfirm,
              close: this.handleClose,
              "after-close": this.handleAfterClose,
              change: this.handleChange,
            },
          });
        },
        data() {
          return {
            props,
          };
        },
        mounted() {
          props.open = true;
        },
        methods: {
          handleConfirm(value) {
            resolve(value);
            props.open = props.onConfirm(value) === false;
          },
          handleClose() {
            reject();
            props.open = props.onCancel() === false;
          },
          handleChange(value) {
            props.disabled = props.onChange(value);
          },
          handleAfterClose() {
            this.$destroy();
          },
        },
        beforeDestroy() {
          requestAnimationFrame(() => {
            vue.$el.parentNode.removeChild(vue.$el);
          });
        },
      });
    });
  };
  Vue.prototype.$actionsheet = (_props, mounted = document.body) => {
    return new Promise((resolve, reject) => {
      let props = Object.assign(
        {
          open: false,
          onClose: () => {
            return true;
          },
          onAction: (value) => {
            return true;
          },
        },
        _props
      );
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = new Vue({
        //eslint-disable-line
        el: node,
        render(createElement) {
          return createElement(
            Actionsheet,
            {
              props: props,
              on: {
                close: this.handleClose,
                action: this.handleAction,
                "after-close": this.handleAfterClose,
              },
              nativeOn: {
                action: this.handleAction,
              },
            },
            props.options.map((item) => {
              return createElement(
                ActionsheetItem,
                {
                  props: {
                    value: item.value,
                  },
                },
                item.label
              );
            })
          );
        },
        data() {
          return {
            props,
          };
        },
        mounted() {
          props.open = true;
        },
        methods: {
          handleClose() {
            reject();
            props.open = props.onClose() === false;
          },
          handleAction(value) {
            resolve(value);
            props.open = props.onAction(value) === false;
          },
          handleAfterClose() {
            this.$destroy();
          },
        },
        beforeDestroy() {
          requestAnimationFrame(() => {
            vue.$el.parentNode.removeChild(vue.$el);
          });
        },
      });
    });
  };
  // element ui 表单解决方案要用到的
  Vue.prototype.dispatch = function (componentName, eventName, params) {
    let parent = this.$parent || this.$root;
    let name = parent.$options.componentName;
    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;
      if (parent) {
        name = parent.$options.componentName;
      }
    }
    if (parent) {
      parent.$emit.apply(parent, [eventName].concat(params));
    }
  };
};

export default {
  install,
  Button,
};
