"use strict";

const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const getOuputPath = (mode) => {
  if (mode === "production") {
    return path.resolve(__dirname, "dist", "public");
  }
  return path.resolve(__dirname, "src", "public");
};

const getOutputFilename = (mode) => {
  if (mode === "production") {
    return "[name].[contenthash]";
  }
  return "[name]";
};

/**
 * @type {import("webpack").Configuration}
 */
module.exports = (env, argv) => {
  console.log("argv", argv);
  return {
    stats: {
      warnings: false,
    },
    mode: argv.mode || "development",
    entry: {
      main: ["./src/static/js/main.js", "./src/static/scss/styles.scss"],
      home: ["./src/static/js/home.js", "./src/static/scss/home.scss"],
      vendors: ["bootstrap", "jquery"],
    },

    output: {
      filename: `js/${getOutputFilename(argv.mode)}.js`,
      path: getOuputPath(argv.mode),
      publicPath: "/public",
    },

    module: {
      rules: [
        {
          test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
          type: "asset/resource",
          generator: {
            //filename: 'fonts/[name]-[hash][ext][query]'
            filename: "fonts/[name][ext][query]",
          },
        },

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
        filename: `css/${getOutputFilename(argv.mode)}.css`,
      }),
    ],

    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
  };
};
