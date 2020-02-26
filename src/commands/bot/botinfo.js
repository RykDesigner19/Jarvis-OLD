const { Command, ClientEmbed } = require("../../");
const moment = require("moment");
require("moment-duration-format");

module.exports = class BotInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'botinfo',
      category: 'bot',
      aliases: ['binfo', 'bi']
    })
  }

  run({ t, author, channel, prefix }, client = this.client.user) {
    const uptime = moment.duration(process.uptime() * 1000).format("d[d] h[h] m[m] s[s]");
    channel.send(new ClientEmbed(author, { thumbnail: client.displayAvatarURL, author: [client] })
      .addField(t('commands:botinfo.stats.title', { client }), t('commands:botinfo.stats.text', {
        uptime, servers: this.client.guilds.size, users: this.client.users.size,
      }), true)
      .addField(t('commands:botinfo.host.title'), t('commands:botinfo.host.text', {
        ram: `${((process.memoryUsage().heapUsed) / 1024 / 1024).toFixed(2)} MB`,
        ping: `${Math.ceil(this.client.ping)} ms`,
        version: process.version
      }), false)
      .addField(t('commands:botinfo.more.title'), t('commands:botinfo.more.text', {
        prefix, dVersion: require("discord.js").version
      }), false)
    )
  }
}