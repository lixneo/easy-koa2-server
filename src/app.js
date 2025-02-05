const Koa = require("koa");
const cors = require("koa2-cors");
const views = require("koa-views");

const app = new Koa();

// 使用 cors 中间件
app.use(cors());

const index = require('./routes/index')

app.use(views(__dirname + "/views", { extension: "ejs" }));

// routes
app.use(index.routes(), index.allowedMethods());

module.exports = app;
