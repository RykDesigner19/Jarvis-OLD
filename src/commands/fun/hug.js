const { Command, ClientEmbed, Utils } = require("../../");

module.exports = class Hug extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'hug',
      category: 'fun',
      aliases: ['abraçar'],
      utils: {
        requirements: { guildOnly: true, apis: ['nekos'] },
        parameters: [{ type: 'user', missingError: 'commands:hug.missingUser' }]
      }
    })
  }

  async run({ t, author, channel, userHuged }, user) {
    const hugImage = await this.client.apis.nekos.getImage('hug')
    const embed = new ClientEmbed(author).setImage(hugImage).setDescription(
      t('commands:hug.successHug', { author, user })
    )

    const channelPromise = (userHuged ? userHuged['edit'](embed) : channel['send'](embed))
    channelPromise.then(m => {
      if (userHuged) return
      m.react('❤️').then(() => {
        const filter = (r, u) => r.emoji.name === '❤️' && u.id === user.id
        return Utils.reactionCollectorResponse(m, filter, { time: 60000, clear: true }).then(result => {
          if (result) this.run({ t, author: user, channel, userHuged: m }, author)
        })
      })
    })
  }
}