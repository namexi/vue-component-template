!function(){"use strict";var t=[,function(t,e,r){function o(t,e,r,o,n,a,s,i){var l,d="function"==typeof t?t.options:t;if(e&&(d.render=e,d.staticRenderFns=r,d._compiled=!0),o&&(d.functional=!0),a&&(d._scopeId="data-v-"+a),s?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(s)},d._ssrRegister=l):n&&(l=i?function(){n.call(this,(d.functional?this.parent:this).$root.$options.shadowRoot)}:n),l)if(d.functional){d._injectStyles=l;var c=d.render;d.render=function(t,e){return l.call(e),c(t,e)}}else{var p=d.beforeCreate;d.beforeCreate=p?[].concat(p,l):[l]}return{exports:t,options:d}}r.d(e,{Z:function(){return o}})}],e={};function r(o){var n=e[o];if(void 0!==n)return n.exports;var a=e[o]={exports:{}};return t[o](a,a.exports,r),a.exports}r.d=function(t,e){for(var o in e)r.o(e,o)&&!r.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var o={};!function(){r.r(o),r.d(o,{default:function(){return e}});var t={name:"Spinner",componentName:"Spinner",props:{color:{type:String,default:""},primaryColor:{type:String,default:""}}},e=(0,r(1).Z)(t,(function(t,e){return t("div",e._g(e._b({class:["vx-spinner--wrapper",e.data.staticClass,e.data.class],style:e.data.staticStyle&&e.data.style?[e.data.staticStyle,e.data.style]:e.data.staticStyle||e.data.style},"div",e.data.attrs,!1),e.listeners),[t("div",{staticClass:"vx-spinner",style:`border-top-color: ${e.props.primaryColor};\n        border-right-color: ${e.props.color};\n        border-bottom-color: ${e.props.color}\n        border-left-color: ${e.props.color}`}),e._t("default")],2)}),[],!0,null,null,null).exports}(),module.exports=o}();