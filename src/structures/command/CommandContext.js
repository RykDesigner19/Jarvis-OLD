module.exports = class CommandContext {
  constructor(options = {}) {
    this.client = options.client
    this.message = options.message
    this.author = options.message.author
    this.member = options.message.member
    this.guild = options.message.guild
    this.channel = options.message.channel

    this.language = options.language
    this.prefix = options.prefix
    this.usedPrefix = options.usedPrefix

    this.aliase = options.aliase
    this.args = options.args
    this.command = options.command

    this.t = () => { throw new Error('Invalid FixedT') }
    this.flags = {}
  }

  setFixedT(translate) {
    this.t = translate
  }

  setFlags(flags) {
    this.flags = flags
  }
}