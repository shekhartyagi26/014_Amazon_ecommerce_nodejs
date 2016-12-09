var express = require('express');

var app = express();

app.get('/name', function(req, res){
	var name = "amit";
    res.json("my name is " + name);
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