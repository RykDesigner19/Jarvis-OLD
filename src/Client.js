const { Client } = require("discord.js");
const { Loader } = require("./");
const loaders = require("./loaders");
const moment = require("moment");

const getDate = () => moment.locale('pt-BR') && moment().format('L LTS');

require("moment-duration-format");

module.exports = class RuneScapeClient extends Client {
  constructor(options = {}) {
    super(options)
    this.regionsLang = require("./utils/json/RegionsLang.json")

    this.loadSystem().then(([l, i]) => {
      this.console(false, `I successfully loaded "${i}" of "${l}" systems!`, 'LoaderSystem')
    })
  }

  login(token = process.env.TOKEN) {
    return super.login(token).then(
      () => this.console(false, 'I successfully connected!', 'LOGIN', 'DISCORD API')
    ).catch((e) => {
      this.console(true, (e.stack || e), 'LOGIN')
      process.exit(1)
    })
  }

  async loadSystem(loadeds = 0) {
    for (let name in loaders) {
      if (loaders[name].prototype instanceof Loader) {
        const loader = new loaders[name](this);
        let success = false
        try {
          success = await loader.start()
          loadeds += 1
          this.console(false, 'Was successfully loaded!', 'LoaderSystem', name)
        } catch (e) {
          this.console(true, (e.stack || e), 'LoaderSystem', name)
        } finally {
          if (!success && loader.critical) process.exit(1)
        }
      } else {
        this.console(true, 'Not Loader!', 'LoaderSystem', name)
      }
    }
    return [Object.entries(loaders).length, loadeds]
  }

 

  console(err, msg, ...nodes) {
    let tag = err ? ' \x1b[31m[ERROR]\x1b[0m' : '';
    let send = `\x1b[32m[${getDate()}]\x1b[0m${tag} ${nodes.length ? `${nodes.map(n => `\x1b[34m[${n}]\x1b[0m`).join(' ')} ${msg}` : msg}`
    console.log(send);
  }
}