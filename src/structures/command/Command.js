const CommandParameters = require('./parameters/CommandParameters.js')
const CommandRequirements = require('./CommandRequirements.js')
const CommandError = require('./CommandError.js')

const Constants = require('../../utils/Constants.js')
const ClientEmbed = require('../ClientEmbed.js')

module.exports = class Command {
  constructor (client, path, options = {}) {
    this.name = options.name
    this.aliases = options.aliases || []
    this.category = options.category || 'general'
    this.hidden = options.hidden

    this.subcommands = []
    this.utils = options.utils || {}

    this.referenceCommand = options.referenceCommand

    this.cooldownTime = options.cooldown
    this.cooldown = this.cooldownTime && this.cooldownTime > 0 && new Map()
    this.cooldownFeedback = this.cooldown && true

    Object.defineProperty(this, 'client', { get: () => client })
    Object.defineProperty(this, 'fullPath', { get: () => path })
  }

  get cmd () {
    return this.referenceCommand ? this.referenceCommand.name : this.name
  }

  get tPath () {
    return this.referenceCommand
      ? `${this.referenceCommand.tPath}.subcommands.${this.name}`
      : `${this.name}`
  }

  get capitalizeName () {
    return this.referenceCommand
      ? `${this.referenceCommand.fullName.capitalize()} ${this.name.capitalize()}`
      : this.name.capitalize()
  }

  get fullName () {
    return this.referenceCommand
      ? `${this.referenceCommand.fullName} ${this.name}`
      : this.name
  }

  async _run (context, args) {
    try {
      this.handleRequirements(context, args)

      const [subcmd] = args
      const subcommand = subcmd && this.getSubcommand(subcmd.toLowerCase())

      if (subcommand) return subcommand._run(context, args.splice(1))

      args = await this.handleParameters(context, args)
      await this.run(context, ...args)
    } catch (e) {
      this.error(context, e)
    }

    return context.channel.stopTyping(true)
  }

  run () {}

  handleRequirements (context, args) {
    return this.utils.requirements
      ? CommandRequirements.handle(context, this.utils.requirements, args)
      : true
  }

  handleParameters (context, args) {
    return this.utils.parameters
      ? CommandParameters.handle(context, this.utils.parameters, args)
      : args
  }

  getSubcommand (subcmd) {
    return this.subcommands.find(
      ({ name, aliases }) => name === subcmd || aliases.includes(subcmd)
    )
  }

  reload () {
    delete require.cache[require.resolve(this.fullPath)]
    const Cmd = require(this.fullPath)
    const command = new Cmd(this.client, this.fullPath)

    this.subcommands.forEach(s => {
      delete require.cache[require.resolve(s.fullPath)]
      const SubcommandRequired = require(s.fullPath)
      const subcommand = new SubcommandRequired(this.client, s.fullPath)
      subcommand.referenceCommand = command
      command.subcommands.push(subcommand)
    })
    return this.client.commands.splice(
      this.client.commands.findIndex(c => c.name === this.name),
      1,
      command
    )
  }

  error ({ t, channel, author, prefix }, error) {
    if (error instanceof CommandError) {
      const usage = this.usage(t, prefix)
      const embed =
        error.embed ||
        new ClientEmbed(author)
          .setTitle(error.message)
          .setDescription(error.showUsage ? usage : '')
      channel.send(embed.setColor(Constants.ERROR_COLOR))
    } else {
      this.client.console(true, error.stack || error, this.name)
    }
    return channel.stopTyping(true)
  }

  usage (t, prefix, noUsage = true, onlyCommand = false) {
    const usagePath = `${this.tPath}.commandUsage`
    const usage = noUsage
      ? t(`commands:${usagePath}`)
      : t([`commands:${usagePath}`, ''])
    if (usage !== usagePath && !onlyCommand) {
      return `**${t('commons:usage')}:** \`${prefix}${this.fullName}${
        usage ? ' ' + usage : ''
      }\``
    } else if (usage !== usagePath && onlyCommand) {
      return `${prefix}${this.fullName}${usage ? ' ' + usage : ''}`
    } else {
      return `**${t('commons:usage')}:** \`${prefix}${this.fullName}\``
    }
  }

  asJSON (t, command = this) {
    const aliases =
      command.aliases && command.aliases.length ? command.aliases : undefined
    const subcommands =
      command.subcommands.length > 0
        ? command.subcommands.map(sc => this.asJSON(t, sc))
        : undefined

    const descriptionPath = `${command.tPath}.commandDescription`
    const usage = command.usage(t, Constants.DEFAULT_PREFIX, false, true)
    let description = t(`commands:${command.tPath}.commandDescription`)
    description = description === descriptionPath ? undefined : description

    return {
      name: command.fullName,
      category: command.category || command.parent.category,
      aliases,
      description,
      usage,
      subcommands
    }
  }
}
