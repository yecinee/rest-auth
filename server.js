var express = require('express'),
bodyParser = require("body-parser"),
morgan = require("morgan"),
config = require("./app/config/config.js"),
mongoose = require('mongoose'),
passport = require("passport")

mongoose.connect(config.dbURI,function(err){
	if (err) console.log(err);
	else console.log("connected to mongodb")
})


var app = express();

app.use(morgan('dev'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))



app.use(passport.initialize());

require('./app/auth/auth.js');


var api = require("./app/routes/api")(express,app)

app.use("/api",api)

app.get('/*',function(req,res){
	res.sendFile(__dirname + "/public/index.html");
})

app.listen(config.port,function(err){
	if (err) console.log(err);
	else console.log('app listening on port '+config.port);
})