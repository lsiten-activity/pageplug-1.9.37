/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");

const common = require("./craco.common.config.js");

module.exports = merge(common, {
  devServer: {
    hot: true,
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },
  optimization: {
    minimize: false,
  },
});
