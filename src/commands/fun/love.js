const { Command, ClientEmbed } = require("../../");

module.exports = class Love extends Command {
    constructor(client, path) {
        super(client, path, {
            name: 'love',
            category: 'fun',
            aliases: ['s2level', 'love'],
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

        let thumb = 'https://media.tenor.com/images/88699685ba8b74fc534913c7376a3288/tenor.gif'

        const love = Math.random() * 100;
        channel.send(new ClientEmbed(author)
        .setThumbnail(thumb)
            .setDescription(`Nivel de amor de : ${author} \npor **${member.username}** \n é de :\`${Math.floor(love)}%\`💟`)

        )
    }
}
