const app = require("../app");
const route = require("../routes/admin-fetch-economy");

app.use("/api/", route);

module.exports = app;