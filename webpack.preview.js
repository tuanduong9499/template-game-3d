const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const metadata = require("./metadata.json");
const path = require("path");

module.exports = {
  entry        : "./src/game.js",
  optimization : {
    minimize: true,
  },
  module: {
    rules: [
      {
        test    : /\.m?js$/,
        exclude : /(node_modules)/,
        use     : {
          loader  : "esbuild-loader",
          options : {
            target: "es6",
          },
        },
      },
    ],
  },
  performance: {
    hints: "warning",
  },
  mode    : "production",
  devtool : false,
  output  : {
    filename : "game.bundle.js",
    path     : path.resolve(__dirname, "preview"),
  },
  plugins: [
    new CleanWebpackPlugin({
      protectWebpackAssets         : false,
      cleanAfterEveryBuildPatterns : ["*.LICENSE.txt"],
    }),
    new webpack.DefinePlugin({
      ADS_TYPE          : JSON.stringify("PREVIEW"),
      REMOVE_MRA        : false,
      SHOW_BUTTON_SOUND : false,
      ADEVENT_LOAD      : JSON.stringify("load"),
    }),
    new webpack.ProvidePlugin({
      pc   : "playcanvas",
      PIXI : "pixi.js",
    }),
    new HtmlWebpackPlugin({
      filename           : `${metadata.buildName}.html`,
      template           : "./src/index.ejs",
      minify             : true,
      templateParameters : {
        adsType : "PREVIEW",
        adsName : metadata.buildName,
      },
      inlineSource: ".(js|css)$",
    }),
    new HtmlInlineScriptPlugin(),
  ],
};
