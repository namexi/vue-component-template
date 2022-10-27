const path = require("path");
const fs = require("fs");

const resolve = (dir) => path.join(__dirname, "./", dir);

module.exports = {
  productionSourceMap: process.env.Component === "component" ? false : true,
  outputDir: process.env.Component === "component" ? "lib" : "dist",
  pages: {
    app: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "Index Page",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "app"],
    },
    lib: {
      // page 的入口
      entry: "src/index.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "comp.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "comp Page",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "lib"],
    },
  },
  configureWebpack: (config) => {
    if (process.env.Component === "component") {
      // 为生产环境修改配置...
      config.plugins = config.plugins.filter((item) => {
        return (
          ["HtmlWebpackPlugin", "CopyPlugin", "ESLintWebpackPlugin"].indexOf(
            item.constructor.name
          ) === -1
        );
      });

      config.performance = {
        hints: false,
      };
      config.stats = {
        children: false,
      };
      config.optimization = {
        minimize: true,
      };
      let Components = {
        index: "./components",
      };
      let ComponentsPath = "./components";

      const files = fs.readdirSync(ComponentsPath);

      files.forEach(function (item) {
        let p = ComponentsPath + "/" + item;
        let stat = fs.lstatSync(p);
        if (stat.isDirectory() === true && ["style"].indexOf(item) == -1) {
          Components[item] = p;
        }
      });
      config.entry = Components;
      config.output.filename = "[name].js";
      config.output.chunkFilename = "[id].js";
      config.output.libraryTarget = "commonjs2";

      config.externals = {
        vue: "vue",
        ...config.externals,
      };
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule("md")
      .test(/\.md/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-markdown-loader")
      .loader("vue-markdown-loader/lib/markdown-compiler")
      .options({
        raw: true,
        preventExtract: true,
        preprocess: function (markdownIt, source) {
          var result = source.match(/##:(\w+):##/g);
          if (result && result[0]) {
            var component = result[0].replace(/##:/g, "").replace(/:##/g, "");
            if (component) {
              var text = fs.readFileSync(
                resolve("src/demos/" + component + ".vue"),
                "utf8"
              );
              return source
                .replace(result[0], text)
                .replace(RegExp(`.less`, "g"), ".css");
            }
          }
          // do any thing
          return source;
        },
      });
    const oneOfsMap = config.module.rule("less").oneOfs.store;

    oneOfsMap.forEach((item) => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          // Or array of paths
          resources: [
            "./components/style/src/theme/common/variable.less",
            "./components/style/src/theme/common/mixins.less",
          ],
        })
        .end();
    });
  },
};
