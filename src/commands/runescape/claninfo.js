const { Command, ClientEmbed } = require("../../");

module.exports = class RuneScapeClanInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'claninfo',
      category: 'runescape',
      aliases: ['clan', 'infoclan']
    })
  }

  run({ t, author, channel, prefix }, client = this.client.user) {
    const embed = new ClientEmbed(author, { author: [client], thumbnail: client.displayAvatarURL, title: t('commands:claninfo.embedTitle') })
    embed.setDescription([
      this.usage(t, prefix),
      '',
      `**${t('commons:texts.versions')}:**`,
      this.subcommands.map(subcmd => `\`${subcmd.name}\``).join(', ')
    ].join('\n'))
    channel.send(embed)
  }
}