var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');
var Cart = require('../models/cart');

var stripe = require('stripe')('sk_test_EYTdmBhtXGwIZVVfGw3rEZcJ');

function paginate(req, res, next){
	var perPage = 9;
     var page = req.params.page;

     Product
        .find()
        .skip( perPage * page)// 9 * 2 = 18 skip 18 doc
        .limit( perPage )
        .populate('category')
        .exec(function(err, products){
        	if (err) return next(err);
        	Product.count().exec(function(err, count){
        	if(err) return next(err);
        	res.render('main/product-main',{
        		products: products,
        		pages: count / perPage
        	});
        });
      });
}

//** mongoosesearch code ** create mapping is use to create replica of mongoose on elastic search.
Product.createMapping(function(err, mapping){
	if(err){
		console.log("error creating mapping");
		console.log(err);
	} else {
		console.log("Mapping created");
		console.log(mapping);
	}
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function(){
	count++;
});

stream.on('close', function(){
	console.log("Indexed"+ count + "documents");
});

stream.on('error', function(err){
	console.log(err);
});
// mongoose search code end here.**

router.get('/cart', function(req, res, next){
	Cart
	  .findOne({ owner: req.user._id })
	  .populate('items.item')
	  .exec(function(err, foundCart){
	  	if(err) return next(err);
	  	res.render('main/cart',{
	  		foundCart: foundCart,
	  		message: req.flash('remove')
	  	});
	  });
   });

router.post('/product/:product_id', function(req, res, next){
	Cart.findOne({ owner: req.user._id }, function(err, cart){
		cart.items.push({
			item: req.body.product_id,
			price: parseFloat(req.body.priceValue),
			quantity: parseInt(req.body.quantity)
		});

		cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

		cart.save(function(err){
			if(err) return next(err);
			return res.redirect('/cart');
		});
	});
});

router.post('/remove', function(req, res, next){
	Cart.findOne({ owner: req.user._id}, function(err, foundCart){
		foundCart.items.pull(String(req.body.item));
		foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);

		foundCart.save(function(err, found){
			if(err) return next(err);
			req.flash('remove','Successfully removed');
			res.redirect('/cart');
		});
	});
});

router.post('/search', function(req, res, next){
	res.redirect('/search?q='+ req.body.q);
});

router.get('/search', function(req, res, next){
	if(req.query.q){
		Product.search({
			query_string: { query: req.query.q}
		}, function(err, results){
			results:
			if (err) return next(err);
			var data = results.hits.hits.map(function(hit){
				return hit;
			});
		   res.render('main/search-result',{
		   	query: req.query.q,
		   	data: data
		   }); 
		});
	  }
	});



router.get('/', function(req, res, next){
	if(req.user){
      paginate(req, res, next);
	} else {
        res.render('main/home');
	}
});

router.get('/page/:page', function(req, res, next){
    paginate(req, res, next);
});

router.get('/about', function(req, res){
	res.render('main/about');
});

// router.get('/users', function(req, res){
// 	User.find({}, function(err, users){
// 		res.json(users);
// 	})
// })

router.get('/products/:id', function(req, res, next){
	Product
	   .find({ category: req.params.id })
	   .populate('category')// populate is used only when our Proudct category is a Schema.Types. 
	   .exec(function(err, products){// exec is used to execute anonymus function. here it excecute multiple time if cateogry are more than one
	   	if(err) return next(err);
	   	res.render('main/category',{
	   		products: products
	   	});
	});
});

router.get('/product/:id', function(req, res, next){
	Product.findById({ _id: req.params.id }, function(err, product){
		if (err) return next(err);
		res.render('main/product',{
			product: product
		});
	});
});

router.post('/payment', function(req, res, next){
	var stripeToken = req.body.stripeToken;
	var currentCharges = Math.round(req.body.stripeMoney * 100);
	stripe.customers.create({
		source: stripeToken,
	}).then(function(customer){
		return stripe.charges.create({
			amount: currentCharges,
			currency: 'usd',
			customer: customer.id
		});
	});
});

module.exports = router;