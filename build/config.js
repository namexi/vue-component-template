// var baseConfig = require("./weboack.base.conf");

// exports.alias = baseConfig.resolve.alias;

var path = require("path");
var fs = require("fs");
var baseConfig = require("./webpack.base.conf");
var nodeExternals = require("webpack-node-externals");
var Components = require("../components.json");

var externals = {};

Object.keys(Components).forEach(function (key) {
  externals[
    `vue-components/src/components/${key}`
  ] = `vue-components/lib/${key}`;
});

externals = [
  Object.assign(
    {
      vue: "vue",
      swiper: "swiper",
      qrcodejs2: "qrcodejs2",
      photoswipe: "photoswipe",
    },
    externals
  ),
  nodeExternals(),
];
console.log(externals);
exports.externals = externals;

exports.alias = baseConfig.resolve.alias;

exports.vue = {
  root: "Vue",
  commonjs: "vue",
  commonjs2: "vue",
  amd: "vue",
};

exports.jsexclude = /node_modules/;
