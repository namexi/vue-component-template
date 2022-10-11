import { createApp, h, onMounted, reactive } from "vue";

import Button from "./button/index";

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    setTimeout;
}

/*
对Date的扩展，将 Date 转化为指定格式的String
月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
*/
Date.prototype.format = function (fmt = "yyyy-MM-dd") {
  // author: meizz
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "H+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
let components = [Button];

const install = (app) => {
  components.map((component) => {
    if (component && component.name) {
      app.component(component.name, component);
    }
  });
  app.config.globalProperties.$toast = (_props, mounted = document.body) => {
    let props = Object.assign(
      {
        open: true,
        onClose: () => {
          return true;
        },
      },
      _props
    );
    let { onClose, message, ...others } = props;
    let node = document.createElement("div");
    mounted.appendChild(node);
    let vue = createApp({
      //eslint-disable-line
      setup() {
        let data = reactive(others);
        const handleClose = () => {
          data.open = onClose() === false;
        };
        const handleAfterClose = () => {
          vue.unmount && vue.unmount();
        };
        return () => {
          return h(
            Toast,
            {
              ...data,
              onClose: handleClose,
              onAfterClose: handleAfterClose,
            },
            message
          );
        };
      },
      beforeUnmount() {
        node.parentNode.removeChild(node);
      },
    });
    vue.mount(node);
    return vue;
  };

  app.config.globalProperties.$alert = (_props, mounted = document.body) => {
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
      let { onCancel, onConfirm, message, ...others } = props;
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = createApp({
        //eslint-disable-line
        setup() {
          const data = reactive(others);
          onMounted(() => {
            data.open = true;
          });
          const handleConfirm = () => {
            resolve();
            data.open = onConfirm() === false;
          };
          const handleClose = () => {
            data.open = onCancel() === false;
            !data.open && reject();
          };
          const handleAfterClose = () => {
            vue.unmount && vue.unmount();
          };
          return () => {
            return h(
              Alert,
              {
                ...data,
                onConfirm: handleConfirm,
                onClose: handleClose,
                onAfterClose: handleAfterClose,
              },
              message
            );
          };
        },
        beforeUnmount() {
          node.parentNode.removeChild(node);
        },
      });
      vue.mount(node);
    });
  };
  app.config.globalProperties.$confirm = (_props, mounted = document.body) => {
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
      let { onCancel, onConfirm, onButtonClick, message, ...others } = props;
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = createApp({
        //eslint-disable-line
        setup() {
          const data = reactive(others);
          onMounted(() => {
            data.open = true;
          });
          const handleConfirm = () => {
            resolve();
            data.open = onConfirm() === false;
          };
          const handleClose = () => {
            data.open = onCancel() === false;
            !data.open && reject();
          };
          const handleAfterClose = () => {
            vue.unmount && vue.unmount();
          };
          const handleButtonClick = (event) => {
            onButtonClick && onButtonClick(event);
          };
          return () => {
            return h(
              Confirm,
              {
                ...data,
                onConfirm: handleConfirm,
                onClose: handleClose,
                onAfterClose: handleAfterClose,
                onButtonClick: handleButtonClick,
              },
              message
            );
          };
        },
        beforeUnmount() {
          node.parentNode.removeChild(node);
        },
      }).mount(node);
    });
  };
  app.config.globalProperties.$prompt = (_props, mounted = document.body) => {
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
            if (value && value.trim && value.trim()) {
              return false;
            } else {
              return true;
            }
          },
        },
        _props
      );
      let { onCancel, onChange, onConfirm, ...others } = props;
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = createApp({
        //eslint-disable-line
        setup() {
          const data = reactive(others);
          onMounted(() => {
            data.open = true;
          });
          const handleConfirm = (value) => {
            resolve(value);
            data.open = onConfirm(value) === false;
          };
          const handleClose = () => {
            data.open = onCancel() === false;
            !data.open && reject();
          };
          const handleChange = (value) => {
            data.disabled = onChange(value);
          };
          const handleAfterClose = () => {
            vue.unmount && vue.unmount();
          };
          return () => {
            return h(Prompt, {
              ...data,
              onConfirm: handleConfirm,
              onClose: handleClose,
              onAfterClose: handleAfterClose,
              "onUpdate:modelValue": handleChange,
            });
          };
        },
        beforeUnmount() {
          node.parentNode.removeChild(node);
        },
      });
      vue.mount(node);
    });
  };
  app.config.globalProperties.$actionsheet = (
    _props,
    mounted = document.body
  ) => {
    return new Promise((resolve, reject) => {
      let props = Object.assign(
        {
          open: false,
          onClose: () => {
            return true;
          },
          onAction: () => {
            return true;
          },
        },
        _props
      );
      let { onClose, onAction, options, ...others } = props;
      let node = document.createElement("div");
      mounted.appendChild(node);
      let vue = createApp({
        //eslint-disable-line
        setup() {
          const data = reactive(others);
          onMounted(() => {
            data.open = true;
          });
          const handleClose = () => {
            data.open = onClose() === false;
            !data.open && reject();
          };
          const handleAction = (value) => {
            resolve(value);
            data.open = onAction(value) === false;
          };
          const handleAfterClose = () => {
            vue.unmount && vue.unmount();
          };
          return () => {
            return h(
              Actionsheet,
              {
                ...data,
                onClose: handleClose,
                onAction: handleAction,
                onAfterClose: handleAfterClose,
              },
              options.map((item) => {
                return h(
                  ActionsheetItem,
                  {
                    value: item.value,
                  },
                  item.label
                );
              })
            );
          };
        },
        beforeUnmount() {
          node.parentNode.removeChild(node);
        },
      });
      vue.mount(node);
    });
  };
  app.config.globalProperties.$preview = (props, close) => {
    let node = document.createElement("div");
    document.body.appendChild(node);
    let vue = createApp({
      setup() {
        const handleClose = () => {
          vue.unmount();
          close && close();
        };
        return () => {
          return h(Preview, {
            ...props,
            onClose: handleClose,
          });
        };
      },
      beforeUnmount() {
        node.parentNode.removeChild(node);
      },
    });
    vue.mount(node);
  };
  app.directive("vx-preview", {
    mounted(el, binding) {
      binding.instance &&
        binding.$preview &&
        el.addEventListener("click", () => {
          if (binding.value) {
            if (typeof binding.value === "string") {
              binding.$preview({ index: 0, list: [binding.value] });
            } else if (binding.value.images) {
              binding.$preview({
                index: binding.value.index,
                list: binding.value.images,
              });
            }
          }
        });
    },
  });
};

export { Button };
export default {
  install,
};
