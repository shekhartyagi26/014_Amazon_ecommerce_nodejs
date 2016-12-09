var mongoose = require('mongoose');
// bcrypt is a library to hash the password
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/* the user schema attributes / characteristics / fields */
var UserSchema = new Schema({
	email: { type: String, Unique: true, lowercase: true},
	password: String,

	profile: {
		name: { type: String, default: ''},
		picture: { type: String, default: ''}
	},

	address: String,
	history: [{
		date: Date,
		paid: { type: Number, default: 0},
		// item: { type: Schema.Type.ObjectId, ref:''}

	}]
})

// var user = new User();
// user.email= "";

/* Hash the password before we even save it to the database */
UserSchema.pre('save', function(next){
  var user = this;// this is for refering the use
   if(!user.isModified('password')) return next();
   bcrypt.genSalt(10, function(err, salt){// genSalt is just random data use for hashing
     if(err) return next(err);
     bcrypt.hash(user.password, salt, null, function(err, hash){
     	if(err) return next(err);
     	user.password = hash;
     	next();
     });
   });
});

/* compare password in the database and the one that the user type in */
UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}


