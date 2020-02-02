const { Command, ClientEmbed } = require("../../")
const moment = require("moment");


module.exports = class roleInfo extends Command {
    constructor(client, path) {
      super(client, path, {
        name: 'roleInfo',
        category: 'information',
        aliases: ['rinfo', 'role', 'si'],
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

    async run ({t,guild,author,channel}){
        channel.send(new ClientEmbed(author,{author: [this.client.user], thumbnail: guild.iconURL || `https://guild-default-icon.herokuapp.com/${guild.nameAcronym}`}))

    }
}  