const { Command, ClientEmbed } = require("../../")

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

  async run({ t, author, channel }, user, client = this.client.user.displayAvatarURL) {
    user = user && user.user || author
    channel.send(new ClientEmbed(author, { author: [client], thumbnail: user.displayAvatarURL })
      .setDescription(t('commands:userinfo.cmdDescription', { user }))
      .addField(t('commands:userinfo.user', {
        user: user.username,
        tag: user.discriminator,
        bot: user.bot
      }))
    )
  }
}
