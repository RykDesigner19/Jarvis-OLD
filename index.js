require("dotenv").config();

const requireClient = require("./src/Client.js");
const initClient = new requireClient({});
initClient.login();