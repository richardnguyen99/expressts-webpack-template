"use strict";

const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
  mode: "development",
  entry: {
    main: ["./src/static/js/main.js", "./src/static/scss/styles.scss"],
  },

  output: {
    filename: "js/[name].[contenthash].js",
    path: path.resolve(__dirname, "src", "public"),
    publicPath: "/public",
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: "css-loader",
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: "sass-loader",
          },
        ],
      },
    ],
  },

  plugins: [
    new WebpackManifestPlugin({
      fileName: "manifest.json",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
  ],
};
