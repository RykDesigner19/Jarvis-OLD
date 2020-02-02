const { Command, ClientEmbed } = require("../../");

module.exports = class ConfigPrefix extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'prefix',
      category: 'configuration',
      referenceCommand: 'config',
      utils: {
        parameters: [{
          type: 'string', full: true, required: false, maxLength: 3,
          missingError: 'commands:config.subcommands.prefix.noPrefix'
        }]
      }
    })
  }

  async run({ t, author, channel, guild }, prefix = process.env.PREFIX) {
    const embed = new ClientEmbed(author);
    await this.client.modules.prefix.updateValues(guild.id, { prefix });
    channel.send(embed.setTitle(t('commands:config.subcommands.prefix.changedSuccessfully', { prefix })))
  }
}