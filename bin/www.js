const app = require("../src/app.js");
const http = require('http')

var server = http.createServer(app.callback());

server.listen(4101)