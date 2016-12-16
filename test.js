// var async = require('async');// async library is use if you want to run something which is depend on some else output

// Category.find({}, function(err, Category){
// 	Product.findOne({ category: category._id}, function(err,productSingle){
// 	});
// });
// if you see inside Product call require output of Category so how we do this because node is async.

// solution 

// async.waterfall([
//  function(callback){
//  	Category.find({}, function(err, category){
//  		if (err) return next(err);
//  		callback(null, category)
//  	});
//  },
//  function(category, callback){
//  	Product.findOne({ category: category._id}, function(err, productSingle){
//  		if(err return next(err));
//  		callback(null, productSingle)
//  	});
//  },
//  function(productSingle,callback){
//  	Product.findById({ _id: productSingle._id}, function(err, product){
//  		if(err) return next(err);
//  		res.render('');
//  		res.redirect
//  	});
//  },
// ])
// here async.waterfall[function,function,function] first function output is used in second function and so on