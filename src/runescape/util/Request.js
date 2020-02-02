const fetch = require("node-fetch");

module.exports = class RuneScapeRequest {
  static async csv(url) {
    try {
      const result = await fetch(url)
        .then(res => res.text())
        .then(res => {
          if (res.includes('<!doctype html>')) return []
          const lines = [];
          res.split('\n').forEach((line) => (line.length > 0) && lines.push(line.split(',')))
          return lines
        })

      if (result.length > 1) return result
      else return false
    } catch (e) {
      throw e
    }
  }

  static async json(url) {
    try {
      const result = await fetch(url).then(res => res.json())
      return result
    } catch (e) {
      if (e.name === 'FetchError') return false
      else throw e
    }
  }
}