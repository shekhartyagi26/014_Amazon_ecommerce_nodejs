var express = require('express');
var morgan = require('morgan');// use for console all request for user.
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');// need this to create flexible web. so we add this also with ejs
var session = require('express-session');// 
var cookieParser = require('cookie-parser');// cookies to store session id
var flash = require('express-flash');
var passport = require('passport');
var MongoStore = require('connect-mongo/es5')(session);

var secret = require('./config/secret');
var User = require('./models/user');

var app = express();

mongoose.connect(secret.database, function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("connected to the database");
	}
})

// Middleware 
app.use(express.static(__dirname +'/public'));//use to add and parse css file in public folder.how to use bootstrap
app.use(morgan('dev'));// this is a way to invoking morgan object. using morgan.
app.use(bodyParser.json());// now our express can parse json data format coming from user
app.use(bodyParser.urlencoded({ extended: true }));// in postman this will only works for x-www-formdata-urlencoded
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');


var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);
// *** use for post data to server that create data in db ***
// app.post();

// *** use for updating data **
// app.put(); 

// *** use for  delete data on server ***
// app.delete();

app.listen(secret.port, function(err){
	if(err) throw err;
	console.log("server is running on " + secret.port);
});