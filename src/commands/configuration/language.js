const { Command, ClientEmbed } = require("../../");
const { Util } = require("discord.js");

const i18next = require("i18next");

module.exports = class ConfigLanguage extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'language',
      category: 'configuration',
      aliases: ['lang'],
      referenceCommand: 'config',
      utils: {
        parameters: [{
          type: 'string',
          full: true,
          whitelist: (arg) => this.client.language.langs.find(a => a.aliases.includes(arg)),
          missingError: ({ t, prefix, author }) => {
            return new ClientEmbed(author)
              .setTitle(t('commands:config.subcommands.language.noCode'))
              .setDescription([
                this.usage(t, prefix),
                '',
                `${t('commands:config.subcommands.language.availableLanguages')}:`,
                `**${this.client.language.langs.map(l => `${l.name(t)} - \`${l.type}\``).join('\n')}**`,
                '',
                `**${Util.escapeMarkdown(`\*${t('commands:config.subcommands.language.missingTranslation')}\*`)}**`
              ].join('\n'))
          }
        }]
      }
    })
  }

  async run({ author, channel, guild }, lang) {
    lang = this.client.language.langs.find(a => a.aliases.includes(lang))

    const embed = new ClientEmbed(author);
    const fixedT = i18next.getFixedT(lang.type);
    await this.client.modules.language.updateValues(guild.id, { language: lang.type });
    channel.send(embed
      .setTitle(fixedT('commands:config.subcommands.language.changedSuccessfully', { lang: lang.name(fixedT) }))
    )
  }
}