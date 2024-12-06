const Koa = require("koa");
const views = require("koa-views");

const app = new Koa();

const index = require('./routes/index')

app.use(views(__dirname + "/views", { extension: "ejs" }));

// routes
app.use(index.routes(), index.allowedMethods());

module.exports = app;
