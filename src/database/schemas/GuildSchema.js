const { Schema } = require("mongoose");

const ModuleSchema = new Schema({
  active: { type: Boolean, required: true },
  values: {}
})

module.exports = {
  name: 'guilds',
  style: 'Guild',
  repositorie: require("../repositories/GuildRepository.js"),
  model: new Schema({
    _id: String,
    prefix: String,
    language: String,
    modules: {
      type: Map,
      of: ModuleSchema
    }
  })
}

/*
  new Schema({
    _id: {
      type: String
    },
    language: {
      type: String,
      default: 'pt-BR'
    },
    prefix: {
      type: String,
      default: process.env.PREFIX
    }
  })
*/