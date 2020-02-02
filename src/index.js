const runescapeUtils = require("./runescape");
const commandStructures = require("./structures/command");

module.exports = {
  // Command Structures

  Command: commandStructures.Command,
  CommandError: commandStructures.CommandError,
  CommandContext: commandStructures.CommandContext,

  // Structures

  Wrapper: require("./structures/Wrapper.js"),
  Loader: require("./structures/Loader.js"),
  Module: require("./structures/Module.js"),
  Listener: require("./structures/Listener.js"),
  ClientEmbed: require("./structures/ClientEmbed.js"),

  // Utils 

  Constants: require("./utils/Constants.js"),
  FileUtils: require("./utils/FileUtils.js"),
  Prototype: require("./utils/Prototype.js"),

  // Others

  runescape: {
    RuneScapeWrapper: runescapeUtils.RuneScapeWrapper,
    apis: runescapeUtils.apis,
    config: runescapeUtils.config,
    methods: runescapeUtils.methods
  }
}