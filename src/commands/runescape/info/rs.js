const { Command, CommandError, ClientEmbed } = require("../../../");
const AsciiTable = require("ascii-table");

const files = ['https://www.pngkey.com/png/detail/472-4720483_old-school-runescape-gold-10m-logo-runescape.png']

module.exports = class rsCommandApi extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'rs',
      category: 'runescape',
      referenceCommand: ['stats', 'claninfo'],
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
          maxLength: { stats: 12, claninfo: 18 },
          missingError: ({ t, author }) => {
            return new ClientEmbed(author).setTitle(t([`commands:${this.cmd}.needInsert`, 'errors:generic']))
          },
          showUsage: true
        }]
      }
    })
  }

  async run({ t, channel, language }, search) {
    const apiMethod = this.client.runescape.rs.hiscores
    const result = await (this.cmd === 'stats' ? apiMethod.player(search) : apiMethod.clan(search))

    if (result) {
      const table = new AsciiTable(t(`commands:${this.tPath}.tableTitle`, { search: search.toUpperCase() }));
      if (this.cmd === 'stats') {
        table.setHeading('Skill', 'Level', 'Experience', 'Rank')
        const arraySkills = Object.entries(result.skills).map(([skill, values]) => ({ skill, ...(values) }))
        arraySkills
          .forEach(v => table.addRow(
            v.skill.capitalize(),
            v.level.localeNumber(language),
            v.exp.localeNumber(language),
            v.rank.localeNumber(language)
          ))
        channel.send(`\`\`\`${table.toString()}\`\`\``)
      } else {
        table.setHeading('', 'Name', 'Rank', 'Experience', 'Kills')
        result.members.slice(0, 10)
          .forEach((m, i) => {
            table.addRow(
              (i + 1),
              m.player,
              m.rank,
              m.exp.localeNumber(language),
              m.kills.localeNumber(language),
            )
          })
        channel.send([
          t(`commands:${this.tPath}.embedTitle`, { clanName: search.capitalize() }),
          t(`commands:${this.tPath}.totalMembers`, { members: result.membersSize }),
          '',
          `\`\`\`${table.toString()}\`\`\``,
          (result.members.length > 10 ? t(`commands:${this.tPath}.andMore`, { size: (result.members.length - 10) }) : '')
        ].join('\n'))
      }
    } else {
      throw new CommandError(t(`commands:${this.cmd}.noFound`))
    }
  }
}