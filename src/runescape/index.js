const config = require("./config");
const methods = require("./apis/methods");
const apis = require("./apis");

module.exports = {
  RuneScapeWrapper: require("./RuneScapeWrapper.js"),
  apis,
  config,
  methods
}