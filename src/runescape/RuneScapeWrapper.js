const methods = require("./apis/methods");
const config = require("./config");

module.exports = class WrapperRuneScape {
  constructor(name) {
    this.name = name
  }

  load() {
    return Promise.all(this.methods.map(method => {
      if (typeof methods[method] === 'function') {
        this[method] = new methods[method](config[this.name])
      }
    }))
  }

  get viewMethods() {
    return {
      methods: this.methods,
      ...this.methods.obj(r => [r, (this[r] && true || false)])
    }
  }
}