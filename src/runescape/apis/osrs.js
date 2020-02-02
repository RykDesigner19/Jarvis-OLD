const RuneScapeWrapper = require("../RuneScapeWrapper.js");

module.exports = class OsrsApi extends RuneScapeWrapper {
  constructor() {
    super('osrs')
    this.displayName = 'OldSchool RuneScape'
    this.methods = ['hiscores', 'ge']
  }
}