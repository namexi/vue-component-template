"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const fs = require("fs");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  use: {
    loader: "eslint-loader",
    options: {
      formatter: require("eslint-friendly-formatter"),
      emitWarning: !config.dev.showEslintErrorsInOverlay,
    },
  },
  enforce: "pre",
  include: [resolve("src"), resolve("test")],
});

console.log("base");
// console.log(vueLoaderConfig);
module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: {
    app: "./src/main.js",
    example: "./examples/src/main.js",
  },
  output: {
    path: config.build.assetsRoot,
    filename: "[name].js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
      assets: resolve("src/assets"),
      components: resolve("src/components"),
      "vx-ui/lib/style/theme": resolve("src/components/style/src/theme"),
      "vx-ui/lib": resolve("src/components"),
      styles: resolve("src/styles"),
      utils: resolve("src/utils"),
      demos: resolve("src/demos"),
      cnode: resolve("src/cnode"),
    },
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        use: [
          "thread-loader",
          {
            loader: "vue-loader",
            options: vueLoaderConfig,
          },
        ],
      },
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader"],
        include: [
          resolve("src"),
          resolve("test"),
          resolve("node_modules/webpack-dev-server/client"),
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: utils.assetsPath("img/[name].[hash:7].[ext]"),
            },
          },
        ],
        type: "javascript/auto",
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]"),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]"),
        },
      },
      {
        test: /\.md$/,
        include: [resolve("examples")],
        use: [
          // 'thread-loader',
          {
            loader: "vue-loader",
          },
          {
            loader: "vue-markdown-loader/lib/markdown-compiler",
            options: {
              raw: true,
              // markdown-it config
              preset: "default",
              breaks: true,
              typographer: true,
              linkify: true,
              preprocess: function (markdownIt, source) {
                var result = source.match(/##:(\w+):##/g);
                if (result && result[0]) {
                  var component = result[0]
                    .replace(/##:/g, "")
                    .replace(/:##/g, "");
                  if (component) {
                    var text = fs.readFileSync(
                      resolve("src/demos/" + component + ".vue"),
                      "utf8"
                    );
                    return source
                      .replace(result[0], text)
                      .replace(RegExp(`.scss`, "g"), ".css");
                  }
                }
                // do any thing
                return source;
              },
              use: [
                /* markdown-it plugin */
                require("markdown-it"),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
};
