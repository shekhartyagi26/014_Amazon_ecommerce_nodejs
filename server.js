var express = require('express');
var morgan = require('morgan');// use for console all request for user.
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/user');

var app = express();

mongoose.connect('mongodb://ammy:suhag007@ds129038.mlab.com:29038/dummy_ecommerce_amit', function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("connected to the database");
	}
})

// Middleware 
app.use(morgan('dev'));// this is a way to invoking morgan object. using morgan.
app.use(bodyParser.json());// now our express can parse json data format coming from user
app.use(bodyParser.urlencoded({ extended: true}));// in postman this will only works for x-www-formdata-urlencoded


app.post('/create-user', function(req, res){
	var user = new User();

	user.profile.name = req.body.name;
	user.password = req.body.password;
	user.email = req.body.email;

	user.save(function(err){
		if(err) next(err);

		res.json('Sucessfully created a new user');
	});
});

// *** use for post data to server that create data in db ***
// app.post();

// *** use for updating data **
// app.put(); 

// *** use for delete data on server ***
// app.delete();

app.listen(3000, function(err){
	if(err) throw err;
	console.log("server is running on 3000");
});