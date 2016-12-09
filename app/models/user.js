var mongoose = require('mongoose'),
	bcrypt = require("bcrypt")

var userSchema = new mongoose.Schema({
	local : {
		name: {
		type: String,
	},
	email: {
		type: String
			},
	password: {
		type: String,
	}
	},
	 facebook         : {
        id           : String,
        email        : String,
        name         : String
    }
	
})

userSchema.pre("save", function(next) {
	user = this;
	if (!user.isModified("local.password")) return next();

	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.local.password, salt, function(err, hash) {
			if (err) return next(err);
			else {
				user.local.password = hash;
				next()
			}
		});
	});

	
})

userSchema.methods.comparePassword = function(password) {
	var user=this;
	return bcrypt.compareSync(password, user.local.password);
}

module.exports = mongoose.model('user', userSchema);