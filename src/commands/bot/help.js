const { Command, ClientEmbed } = require("../../");

const regexpSpecialChars = /([[\]^$|()\\+*?{}=!.])/gi
const quoteRegex = (text) => text.replace(regexpSpecialChars, '\\$1')
const prefixRegex = (prefix) => new RegExp(`^${quoteRegex(prefix)}`)

module.exports = class Help extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'help',
      category: 'bot',
      aliases: ['commands'],
      utils: {
        parameters: [{
          type: 'string', full: true, required: false
        }]
      }
    })
  }

  run(context, cmd) {
    const { t, channel, author, prefix } = context;

    const embed = new ClientEmbed(author)
    const validCommands = this.client.commands.filter(c => !c.hidden);

    if (cmd) {
      cmd = cmd.replace(prefixRegex(prefix), '')
      const command = cmd.split(' ').reduce((o, ca) => {
        const arr = (Array.isArray(o) && o) || (o && o.subcommands)
        if (!arr) return o
        return arr.find(c => (c.name === ca.toLowerCase()) || c.aliases.includes(ca.toLowerCase()))
      }, validCommands);

      if (command) {
        const fields = [
          [t('commands:help.usage'), `**\`${command.usage(t, prefix, false, true)}\`**`],
          [t('commands:help.category'), `**\`${t(`categories:${command.category}`)}\`**`]
        ]

        if (command.aliases.length > 0) fields.push([t('commands:help.aliases'), command.aliases.map(a => `**\`${a}\`**`).join(', ')]);
        if (command.utils.requirements && command.utils.requirements.permissions) {
          fields.push([t('commands:help.permissions'), command.utils.requirements.permissions.map(p => `**\`${t(`permissions:${p}`)}\`**`).join(', ')])
        }
        if (command.utils.requirements && command.utils.requirements.botPermissions) {
          fields.push([t('commands:help.botPermissions'), command.utils.requirements.botPermissions.map(p => `**\`${t(`permissions:${p}`)}\`**`).join(', ')])
        }
        if (command.subcommands.length) fields.push([
          t('commands:help.subcommands'), command.subcommands.map(s => `**\`${s.name}\`**`).join(', ')
        ])

        fields.forEach(field => embed.addField(...field))
        channel.send(embed
          .setAuthor(command.capitalizeName)
          .setTitle(t([`commands:${command.tPath}.commandDescription`, 'commands:help.noDescriptionProvided']))
        )
      } else this.helpSend(context, embed, validCommands)
    } else this.helpSend(context, embed, validCommands)
  }

  helpSend({ t, channel, prefix }, embed, validCommands) {
    const categories = validCommands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i)
    categories
      .sort((a, b) => t(`categories:${a}`).localeCompare(t(`categories:${b}`)))
      .forEach(category => {
        const commands = validCommands
          .filter(c => c.category === category)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(c => `\`${c.name}\``).join('**, **')
        embed.addField(t(`categories:${category}`), commands, false)
      })

    channel.send(embed
      .setAuthor(t('commands:help.listTitle'), this.client.user.displayAvatarURL)
      .setTitle(`${t('commands:help.specificInformation', { helpString: this.usage(t, prefix, false, true) })}`)
      .setDescription([
        'ㅤ',
        `**${t('commands:help.prefix')}:** \`${prefix}\` || ${this.client.user.toString()}`,
        'ㅤ'
      ].join('\n'))
    )
  }
}