const common = require("./webpack.common.config.js");
const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "js/[name].[contenthash:12].js",
  },
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["imagemin-mozjpeg", { quality: 40 }],
              [
                "imagemin-pngquant",
                {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
              ],
              ["imagemin-gifsicle", { interlaced: true }],
              [
                "imagemin-svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // we told explicitly webpack to code split for jquery and bootstrap
    // splitChunks: {
    //   cacheGroups: {
    //     jquery: {
    //       test: /[\\/]node_modules[\\/]jquery[\\/]/,
    //       chunks: "initial", // 'async'  'all'
    //       name: "jquery", // give name to the generated bundle file
    //     },
    //     bootstrap: {
    //       test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
    //       chunks: "initial", // 'async'  'all'
    //       name: "bootstrap", // give name to the generated bundle file
    //     },
    //   },
    // },
    // code split automatically by webpack
    splitChunks: {
      chunks: "all",
      maxSize: 140000,
      minSize: 50000,
      name(module, chunks, cacheGroupKey) {
        const filePathAsArray = module.identifier().split("/");
        return filePathAsArray[filePathAsArray.length - 1];
      }, // generate names in dist folder according to the package
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
        generator: {
          filename: "./images/[name].[contenthash:12][text]",
        },

        // commented this to use image-minimizer-webpack-plugin
        // use: [
        //   // approach 1
        //   {
        //     loader: "image-webpack-loader",
        //     options: {
        //       mozjpeg: {
        //         quality: 40, // 0-100 -> 40 is enough
        //       }, // jpeg compressor
        //       pngquant: {
        //         quality: [0.65, 0.95],
        //         speed: 4,
        //       }, // png compressor -> reduces file sizes by converting images to a more efficient 8 bit png formate
        //     },
        //   },
        // ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:12].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "../src")}/**/*`, {
        nodir: true, // no directories only files
      }),
    }),
  ],
});
