const { FileUtils, Module, Loader } = require('../')

module.exports = class ModulesLoader extends Loader {
  constructor (client) {
    super('ModulesLoader', client)
    this.critical = true
    this.modules = {}
  }

  async start () {
    this.client.modules = await this.loadModules()
    return true
  }

  loadModules () {
    return FileUtils.requireDirectory(
      'src/modules',
      this.validateModule.bind(this)
    ).then(() => this.modules)
  }

  validateModule ({ file, required: NewModule }) {
    if (NewModule.prototype instanceof Module) {
      const module = new NewModule(this.client)
      this.modules[module.name] = module
      this.client.console(
        false,
        'Module was successfully loaded!',
        this.name,
        module.displayName
      )
    } else {
      this.client.console(true, 'Not Module!', this.name, file)
    }
    return true
  }
}
