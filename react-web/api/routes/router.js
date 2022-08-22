//routing for local development server (devServer.js)

const routes = require("express").Router();

const guilds = require("./admin-fetch-guilds");
const cmds = require("./admin-fetch-commands");
const econ = require("./admin-fetch-economy");

routes.get("/", async function (req, res) {
  //homepage route returns some HTML
    res.send('Poop');
});

routes.use("/", guilds);
routes.use("/", econ);
routes.use("/", cmds);

module.exports = routes;