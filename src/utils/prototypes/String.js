const Prototype = require('../Prototype.js')

module.exports = class StringPrototypes extends Prototype {
  static load () {
    // capitalize

    /**
     * @returns {string}
     */
    // eslint-disable-next-line no-extend-native
    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1)
    }

    //

    // allReplaces

    /**
     * @param {object} replaces
     * @returns {string} String replaced by entered values
     */
    // eslint-disable-next-line no-extend-native
    String.prototype.allReplaces = function (replaces) {
      let str = this

      if (!(replaces instanceof Object)) return this

      Object.entries(replaces).forEach(([k, v]) => {
        const replaceRegex = new RegExp(k, 'gi')
        str = str.replace(replaceRegex, v)
        return str
      })

      return str
    }
  }
}
