const common = require("./webpack.common.config.js");
const { merge } = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "bundle.js",
  },
  devServer: {
    port: 9000, // the server is going to be running
    static: {
      // directory: path.resolve(__dirname, ".."), // pointing webpack dev server to the root folder (before the template.html reference)
      directory: path.resolve(__dirname, "../dist"), // pointing webpack dev server to the root folder (after template.html reference)
    },
    devMiddleware: {
      index: "index.html", // root file
      writeToDisk: true, // true then keep the dist folder, false then it will delete the dist folder
    },
    client: {
      overlay: true, // show errors live in the browers
    },
    liveReload: true, // live reload if changes are made
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/, // exclude module.css files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/, // only include module.css
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]--[md4:hash:7]", // makes class name with [currentclassname]--hashedvalue
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
});
