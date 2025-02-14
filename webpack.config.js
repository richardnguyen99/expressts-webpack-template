"use strict";

const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

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
 * @type {(env, argv) => import("webpack").Configuration}
 */
module.exports = (env, argv) => {
  console.log("argv", argv);
  return {
    stats: {
      warnings: true,
      errorDetails: true,
    },
    mode: argv.mode || "development",
    entry: {
      main: "./src/static/js/main.js",
      home: "./src/static/js/home.js",
      form: "./src/static/js/form.js",
      styles: "./src/static/scss/styles.scss",
      faqStyles: "./src/static/scss/faq.scss",
      homeStyles: "./src/static/scss/home.scss",
      blogStyles: "./src/static/scss/blog.scss",
      userStyles: "./src/static/scss/user.scss",
      theme: {
        import: "./src/static/js/theme.js",
        chunkLoading: false,
        runtime: false,
        library: {
          type: "var",
          name: "theme",
          export: "default",
        },
      },
    },

    output: {
      filename: `js/${getOutputFilename(argv.mode)}.js`,
      path: getOuputPath(argv.mode),
      publicPath: "/public/",
      assetModuleFilename: "fonts/[contenthash][ext][query]",
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
                  plugins: () => [autoprefixer],
                },
              },
            },
            {
              // Loads a SASS/SCSS file and compiles it to CSS
              loader: "sass-loader",
            },
          ],
        },

        {
          test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
          type: "asset/resource",
        },
      ],
    },

    plugins: [
      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, "src", "static", "favicon.ico"),
        cache: true,
        publicPath: "/public",
        prefix: "assets/[contenthash]",
      }),
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
        chunks(chunk) {
          return chunk.name !== "theme";
        },
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
