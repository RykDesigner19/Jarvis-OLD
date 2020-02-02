const { Command, ClientEmbed } = require("../../");

module.exports = class RuneScapeStatsActivities extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'activities',
      category: 'runescape',
      aliases: ['activity']
    })
  }

  run({ t, author, channel, prefix }, client = this.client.user) {
    const embed = new ClientEmbed(author, { author: [client], thumbnail: client.displayAvatarURL, title: t('commands:activities.embedTitle') })
    embed.setDescription([
      this.usage(t, prefix),
      '',
      `**${t('commons:texts.versions')}:**`,
      this.subcommands.map(subcmd => `\`${subcmd.name}\``).join(', ')
    ].join('\n'))
    channel.send(embed)
  }
}