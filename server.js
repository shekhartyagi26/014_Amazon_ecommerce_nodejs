var express = require('express');
var morgan = require('morgan');// use for console all request for user.
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://ammy:<dbpassword>@ds129038.mlab.com:29038/dummy_ecommerce_amit', function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("connected to the database");
	}
})

// Middleware 
app.use(morgan('dev'));// this is a way to invoking morgan object. using morgan.


app.get('/name', function(req, res){
	var name = "amit";
    res.json("my name is " + name);
});

app.get('/catname', function(req, res){
   res.json('batman');
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