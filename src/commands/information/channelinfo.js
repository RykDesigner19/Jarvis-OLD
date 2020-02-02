const { Command, ClientEmbed } = require("../../")
const moment = require("moment");

module.exports = class ChannelInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'channelinfo',
      category: 'information',
      aliases: ['channel', 'ci'],
      utils: {
        requirements: { guildOnly: true },
        parameters: [{
          type: 'channel',
          onlySameGuild: true,
          acceptText: true,
          acceptVoice: true,
          acceptCategory: true,
          required: false
        }]
      }
    })
  }

  async run({ t, author, guild, channel }) {
    channel.send(new ClientEmbed(author)
      .setAuthor(this.client.user.username, this.client.displayAvatarURL)
      .setThumbnail(this.client.user.displayAvatarURL)
      .setDescription(t(`commands:channelinfo.cmdDescription`))
      .addField(t(`commands:channelinfo.channelTitle`), t('commands:channelinfo.about', {
        channel: channel.name,
        created: `${moment(channel.createdAt).format('LLL')}`,
        type: channel.type,
        Id: channel.id,
        position: channel.position,
        userLimit: channel.userLimit
      }), true)
    )
  }
}