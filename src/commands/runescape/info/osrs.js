const { Command, CommandError, ClientEmbed } = require("../../../");
const AsciiTable = require("ascii-table");

module.exports = class rsCommandApi extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'osrs',
      category: 'runescape',
      aliases: ['oldschool', 'oldrs'],
      referenceCommand: 'stats',
      utils: {
        requirements: {
          runescape: {
            apis: ['osrs'],
            methods: [{
              api: 'osrs',
              type: 'hiscores'
            }]
          }
        },
        parameters: [{
          type: 'string',
          full: true,
          maxLength: 12,
          missingError: ({ t, author }) => {
            return new ClientEmbed(author).setTitle(t([`commands:${this.cmd}.needInsert`, 'errors:generic']))
          },
          showUsage: true
        }]
      }
    })
  }

  async run({ t, channel, language }, player) {
    const apiMethod = this.client.runescape.osrs.hiscores
    const result = await apiMethod.player(player, 'normal')

    if (result) {
      const table = new AsciiTable(t(`commands:${this.tPath}.tableTitle`, { player: player.toUpperCase() }));
      table.setHeading('Skill', 'Level', 'Experience', 'Rank')

      const arraySkills = Object.entries(result.skills).map(([skill, values]) => ({ skill, ...(values) }))
      arraySkills.forEach(v => table
        .addRow(
          v.skill.capitalize(),
          v.level.localeNumber(language),
          v.exp.localeNumber(language),
          v.rank.localeNumber(language)
        )
      )
      channel.send(`\`\`\`${table.toString()}\`\`\``)
    } else {
      throw new CommandError(t(`commands:${this.cmd}.noFound`))
    }
  }
}