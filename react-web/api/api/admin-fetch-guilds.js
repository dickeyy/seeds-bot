const app = require("../app");
const route = require("../routes/admin-fetch-guilds");

app.use("/api/", route);

module.exports = app;