var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db.js')
var routes = require('./routes/index.js');
app.use(db())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', routes);
app.listen(3000,function() {
    console.log("Server started at port number: 3000");
});