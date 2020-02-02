const RuneScapeWrapper = require("../RuneScapeWrapper.js");

module.exports = class RsApi extends RuneScapeWrapper {
  constructor() {
    super('rs')
    this.displayName = 'RuneScape'
    this.methods = ['bestiary', 'hiscores', 'ge']
  }
}