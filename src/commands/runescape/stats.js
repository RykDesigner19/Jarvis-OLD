const { Command, ClientEmbed } = require("../../");

module.exports = class RuneScapeStats extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'stats',
      category: 'runescape',
      aliases: ['profile', 'rsinfo', 'info']
    })
  }

  run({ t, author, channel, prefix }, client = this.client.user) {
    const embed = new ClientEmbed(author, { author: [client], thumbnail: client.displayAvatarURL, title: t('commands:stats.embedTitle') })
    embed.setDescription([
      this.usage(t, prefix),
      '',
      `**${t('commons:texts.versions')}:**`,
      this.subcommands.map(subcmd => `\`${subcmd.name}\``).join(', ')
    ].join('\n'))
    channel.send(embed)
  }
}