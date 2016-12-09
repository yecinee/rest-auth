var User = require("../models/user.js"),
	config = require("../config/config.js"),
	jwt = require('jsonwebtoken'),
	passport = require("passport")

function createToken(user) {
	return jwt.sign({
		id: user._id
	}, config.secretKey, {
		expiresIn: '24h'
	})
}

module.exports = function(express, app) {

	var api = express.Router();

	api.post('/signup', function(req, res) {
		if (!req.body.name || !req.body.email || !req.body.password) {
			res.json({
				success: false,
				msg: "name , email and password are required"
			})

		} else {
			var user = new User();
			
				user.local.name= req.body.name,
				user.local.email= req.body.email,
				user.local.password= req.body.password
			

			user.save(function(err) {
				if (err) {
					res.json({
						success: false,
						msg: "email already exists" + err
					});
					return
				}
				var token = createToken(user);
				res.json({
					success: true,
					msg: "user created",
					token: "JWT " + token
				})
			})
		}
	})

	api.post("/login", function(req, res) {


		User.findOne({
			"local.email": req.body.email
		}).select('local.password local.name local.email').exec(function(err, user) {
			if (err) throw err;
			if (!user) res.json({
				success: false,
				msg: "no user found"
			});
			else if (user) {
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) res.json({
					success: false,
					msg: "wrong password"
				});
				else {
					var token = createToken(user);
					res.json({
						success: true,
						msg: "successfully logged in",
						token: "JWT " + token
					})

				}
			}
		})
	})

	api.get("/auth/facebook/", passport.authenticate('facebook-token', {
			"session": false
		}),
		function(req, res) {
			var token = createToken(req.user);
					res.json({
						success: true,
						msg: "successfully logged in",
						token: "JWT " + token
					})
			// do something with req.user
			
		})


	api.get("/user", passport.authenticate('jwt', {
		session: false
	}), function(req, res) {
		res.json(req.user)
	})



	return api

}