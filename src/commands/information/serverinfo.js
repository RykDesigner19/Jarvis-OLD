const { Command, ClientEmbed } = require("../../")
const moment = require("moment");

module.exports = class ServerInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'serverinfo',
      category: 'information',
      aliases: ['sinfo', 'guild', 'si'],
      utils: {
        requirements: { guildOnly: true },
        parameters: [{
          type: 'guild',
          full: true,
          required: false
        }]
      }
    })
  }

  async run({ t, author, channel, language }, guild = channel.guild) {
    channel.send(new ClientEmbed(author, { author: [this.client.user], thumbnail: guild.iconURL || `https://guild-default-icon.herokuapp.com/${guild.nameAcronym}` })
      .addField(t('commands:serverinfo.owner.title', { guild }), t('commands:serverinfo.owner.text', {
        owner: guild.owner,
        founded: `${moment(guild.createdAt).format('LLL')}`,
        region: t(`regions:regions.${guild.region}`)
      }), true)
      .addField(t('commands:serverinfo.info.title', { guild }), t('commands:serverinfo.info.text', {
        members: guild.memberCount,
        bots: guild.members.filter(u => u.user.bot).size. localeNumber(language),
        verified: guild.verified,
        verification: guild.verificationLevel
      }), false)
      .addField(t('commands:serverinfo.structure.title', { guild }), t('commands:serverinfo.structure.text', {
        total: guild.channels.size,
        text: guild.channels.filter(c => c.type === 'text').size. localeNumber(language),
        voice: guild.channels.filter(c => c.type === 'voice').size. localeNumber(language),
        category: guild.channels.filter(c => c.type === 'category').size. localeNumber(language)
      }), false)
      .addField(t('commands:serverinfo.miscellaneous.title', { guild }), t('commands:serverinfo.miscellaneous.text', {
        emojis: guild.emojis.size. localeNumber(language),
        roles: guild.roles.size. localeNumber(language),
        afkChannel: guild.afkChannel && guild.afkChannel.name || t('commons:none'),
        afkTime: moment.duration(guild.afkTimeout, 'seconds').format('hh:mm:ss', { stopTrim: 'm' })
      }), false)
    )
  }
}
