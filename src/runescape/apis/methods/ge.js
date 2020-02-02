const request = require("../../util/Request.js");

module.exports = class GrandExchange {
  constructor(config) {
    this.name = 'ge'
    this.config = config[this.name]
  }
}