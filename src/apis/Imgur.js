const fetch = require('node-fetch')
const { Wrapper } = require('../')

const API_URL = 'https://api.imgur.com/3'

module.exports = class ImgurWrapper extends Wrapper {
  constructor () {
    super('imgur')
    this.envVars = ['IMGUR_CLIENT_ID']
  }

  postImage (image) {
    return this.request('/image', 'POST', { image })
  }

  getImage (id) {
    return this.request(`/image/${id}`)
  }

  request (endpoint, method = 'GET', body) {
    body =
      method.toUpperCase() !== 'GET'
        ? body
          ? JSON.stringify(body)
          : null
        : null

    return fetch(`${API_URL}${endpoint}`, {
      method,
      body,
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }
}
