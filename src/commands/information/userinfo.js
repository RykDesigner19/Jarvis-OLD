const { Command, ClientEmbed } = require("../../")
const moment = require("moment");

module.exports = class UserInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'userinfo',
      category: 'information',
      aliases: ['uinfo', 'user', 'ui'],
      utils: {
        parameters: [{
          type: 'member',
          full: true,
          required: false,
          acceptBot: true
        }]
      }
    })
  }

  async run({ t, author, guild, channel }, member) {
    member = member && member.user || author
    channel.send(new ClientEmbed(author)
      .setAuthor(this.client.user.username, this.client.displayAvatarURL)
      .setThumbnail(member.displayAvatarURL)
      .addField(t(`commands:userinfo.cmdDescription`, { guild }), t('commands:userinfo.userDescription', {
        member: member.username,
        tag: member.discriminator,
        bot: member.bot
      }), true)
      .addField(t(`commands:userinfo.moreInformation.more`), t('commands:userinfo.moreInformation.userInformation', {
        created: `${moment(member.createdAt).format('LLL')}`,
        id: member.id,
      }), false)
      .addField(t(`commands:userinfo.presence.presenceTitle`), t('commands:userinfo.presence.presenceInfo', {
        game: member.presence.game,
        status: member.presence.status
      }), false)
    )
  }
}
