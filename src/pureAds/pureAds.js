let PureAds = null;

try {
  PureAds = require("../../pureAds/src/pureAds").default;
}
catch (e) {
  PureAds = require("./pureAds.mock").default;
}
export default PureAds;
