const { Command, ClientEmbed } = require("../../");

module.exports = class Gay extends Command {
    constructor(client, path) {
        super(client, path, {
            name: 'gay',
            category: 'fun',
            aliases: ['gay', 'gaylevel'],
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
    run({ t, author, channel}, member) {
        member = member && member.user || author

        const viado = Math.random() * 100;
        let thumb = 'https://media1.tenor.com/images/df2de87355103b2d68363d96822a857b/tenor.gif?itemid=4935162'

        channel.send(new ClientEmbed(author)
        .setThumbnail(thumb)
         .setDescription(`${author} você está 🏳️‍🌈\`${Math.floor(viado)}\`% viado hoje...`)
        );
    }
}
