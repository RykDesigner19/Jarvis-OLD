const { CommandContext, Listener } = require("../../");

const getMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const getPrefix = (m, p) => p.find(pr => m.content.startsWith(pr));

module.exports = class MessageResponses extends Listener {
  constructor(client) {
    super(client)
    this.events = ['message', 'messageUpdate']
  }

  onMessageUpdate(oldM, newM) {
    if (!(newM.edits.length > 2 || oldM.author.bot)) {
      if (!(oldM.content === newM.content) && newM.content.trim().length) this.client.emit('message', newM);
    }
    return true
  }

  async onMessage(message) {
    if (message.author.bot) return;

    const guildId = message.guild && message.guild.id;

    const { prefix, spacePrefix } = await this.client.modules.prefix.retrieveValues(guildId, ['prefix', 'spacePrefix']);
    const language = await this.client.modules.language.retrieveValue(guildId, 'language');
    const usedPrefix = getPrefix(message, [prefix, `<@!${this.client.user.id}>`, `<@${this.client.user.id}>`]);

    if (usedPrefix && (message.content.length > usedPrefix.length)) {
      const fullCmd = message.content.substring(usedPrefix.length).split(/[ \t]+/).filter(a => !spacePrefix || a)
      const args = fullCmd.slice(1);

      const insert = fullCmd[0].toLowerCase().trim();
      const command = this.client.commands.find(({ name, aliases }) => (name === insert) || aliases.includes(insert));

      if (command && (message.guild && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') || true)) {
        const context = new CommandContext({
          client: this.client,
          aliase: command.aliases.some(al => al.toLowerCase() === insert) && insert,
          usedPrefix, message, command, prefix, args, language
        })

        context.setFixedT(this.client.language.i18next.getFixedT(language))
        return command._run(context, args).catch(
          (e) => this.client.console(true, (e.stack || e), 'CommandRun', command.name)
        )
      }
    }
  }
}