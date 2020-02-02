const { Command, CommandError, ClientEmbed } = require("../../../");
const AsciiTable = require("ascii-table");

const files = ['https://www.pngkey.com/png/detail/472-4720483_old-school-runescape-gold-10m-logo-runescape.png']

module.exports = class rsCommandApi extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'rs',
      category: 'runescape',
      referenceCommand: 'activities',
      utils: {
        requirements: {
          runescape: {
            apis: ['rs'],
            methods: [{ api: 'rs', type: 'hiscores' }]
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
    const apiMethod = this.client.runescape.rs.hiscores
    const result = await apiMethod.player(player)

    if (result) {
      const table = new AsciiTable(t(`commands:${this.tPath}.tableTitle`, { player: player.toUpperCase() }));
      table.setHeading('', 'Name', 'Rank', 'Score')

      const arraySkills = result.activities
      arraySkills.forEach((a, i) => table
        .addRow(
          (i + 1),
          a.name,
          a.rank.localeNumber(language),
          a.score.localeNumber(language)
        )
      )
      channel.send(`\`\`\`${table.toString()}\`\`\``)
    } else {
      throw new CommandError(t(`commands:${this.cmd}.noFound`))
    }
  }
}