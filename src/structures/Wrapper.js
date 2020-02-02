module.exports = class Wrapper {
  constructor(name, client) {
    this.name = name
    this.client = client
  }

  load() {
    return this
  }
}