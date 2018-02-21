var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
require('./config');
var app = express();
var http = require('http');

app.use(bodyParser.json());
app.use("/", require("./web/index.js"));

var port = 3000;

http.createServer(app).listen(port, function() {
    console.log(`App runnning on port: ${port}`);
});
