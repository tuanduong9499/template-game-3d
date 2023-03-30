module.exports = ({ env }) => {
  if (env === "export") {
    return require("./pureads/webpack.pureads.js");
  }

  const envConfig = require(`./webpack.${env}.js`);
  return envConfig;
};
