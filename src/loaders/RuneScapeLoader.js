const { runescape: { apis, RuneScapeWrapper }, Loader } = require("../");

const displayNames = {
  rs: 'RuneScape',
  osrs: 'OldSchool RuneScape'
}

module.exports = class RuneScapeLoader extends Loader {
  constructor(client) {
    super('RuneScapeLoader', client)

    Object.defineProperty(this, 'runescape', {
      value: {
        getApi: (...params) => this.getApi(...params)
      },
      writable: true
    })
  }

  async start() {
    this.client.runescape = await apis.callbackValue(this.validateApi.bind(this)).then(() => this.runescape)
    return true
  }

  async validateApi(api) {
    const err = (e) => this.client.console(true, (e.stack || e), this.name, api.name);

    if (api.prototype instanceof RuneScapeWrapper) {
      try {
        const rsapi = new api()
        await rsapi.load()
        this.runescape[rsapi.name] = rsapi
        this.client.console(false, 'RuneScapeApi was successfully loaded!', this.name, rsapi.name)
      } catch (e) {
        err(e)
      }
    } else err('No Api!')
    return true
  }

  getApi(apis, view) {
    if (!(apis instanceof Array)) throw new TypeError('No api inserted!')
    const result = apis.map(api => [api, (this.runescape[api] && true || false)])
    return view
      ? result.map(([k, v]) => v ? false : k).filter(r => r).map(n => displayNames[n])
      : result.map(([k, v]) => v && k).filter(r => r).length === apis.length
        ? true
        : false
  }
}