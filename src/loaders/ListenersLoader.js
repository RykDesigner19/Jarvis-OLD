const { FileUtils, Listener, Loader } = require("../");

module.exports = class ListenersLoader extends Loader {
  constructor(client) {
    super('ListenersLoader', client)
    this.critical = true
  }

  async start() {
    return await this.loadListeners()
  }

  loadListeners() {
    return FileUtils.requireDirectory(
      'src/client/listeners',
      this.validateListener.bind(this),
      (e, file) => this.client.console(true, (e.stack || e), this.name, file)
    ).then(() => true)
  }

  validateListener({ file, required }) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    if (required.prototype instanceof Listener) {
      const listener = new required(this.client);
      listener.events.forEach(event => {
        const hasFunction = listener.eventsFc[event]
        if (hasFunction) {
          this.client.on(event, (...args) => listener[`on${event.capitalize()}`](...args))
          this.client.console(
            false,
            'Listener function was successfully loaded!',
            this.name,
            event.capitalize()
          )
        }
      })
    } else {
      this.client.console(true, 'Not Listener!', this.name, file);
    }
    return true
  }
}