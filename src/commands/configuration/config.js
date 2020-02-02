const { Command, ClientEmbed } = require("../../");

module.exports = class Config extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'config',
      category: 'configuration',
      aliases: ['cfg'],
      utils: {
        requirements: { guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD'] }
      }
    })
  }

  run({ t, author, channel, prefix }, client = this.client.user) {
    const embed = new ClientEmbed(author, { author: [client], thumbnail: client.displayAvatarURL })
    embed.setDescription(this.subcommands.map(subcmd => {
      const path = `commands:${subcmd.tPath}`
      return `${t(`${path}.info`)}\n${subcmd.usage(t, prefix, false)}\n`
    }).join('\n'))
    channel.send(embed)
  }
}