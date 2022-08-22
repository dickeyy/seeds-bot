const app = require("../app");
const route = require("../routes/admin-fetch-commands");

app.use("/api/", route);

module.exports = app;