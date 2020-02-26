const { Command, ClientEmbed } = require("../../");

module.exports = class SetAvatar extends Command {
  constructor(client, path) {
    super(client, path, {
      name: "setAvatar",
      category: "developer",
      aliases: ["setavatar"],
      hidden: true,
      utils: {
        requirements: { devOnly: true }
      }
    });
  }
  async run({ channel, author, args, t }) {
    const avatar =
      args[0] || channel.attachments.slice()
        ? channel.attachments.slice().url
        : undefined;
    if (!avatar || avatar === undefined)
      return channel.send("error", t("commands:changeavatar.args-null"));

    this.client.user.setAvatar(avatar).then(() => {
      channel.send(new ClientEmbed(author))
        .setDescription(t("commands:changeavatar.avatar"))
        .setImage(avatar);
    });
  }
};
