"use strict";

const path = require("path");
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
      theme: {
        import: "./src/static/js/theme.js",
        library: {
          type: "umd",
          name: "theme",
        },
      }
    },

    output: {
      filename: `js/${getOutputFilename(argv.mode)}.js`,
      path: getOuputPath(argv.mode),
      publicPath: "/public/",
    },

    module: {},

    plugins: [
      new WebpackManifestPlugin({
        fileName: "manifest.json",
        writeToFileEmit: false
      }),
    ],
  };
};
