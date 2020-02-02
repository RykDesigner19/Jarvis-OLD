const request = require("../../util/Request.js");

module.exports = class Bestiary {
  constructor(config) {
    this.name = 'bestiary'
    this.config = config[this.name]
  }

  async beast(id) {
    const result = await request.json(`${this.config.urls.beast + encodeURIComponent(id)}`)
    return result
  }
}