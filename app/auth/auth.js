var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require("../models/user.js"),
    passport = require("passport"),
    config=require("../config/config"),
        ExtractJwt = require('passport-jwt').ExtractJwt



var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = config.secretKey;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    User.findById(jwt_payload.id, function(err, user) {
        console.log(jwt_payload)
        if (err) {
            console.log(err)
            return done(err, false);
        }
        if (user) {
            console.log(user)
            done(null, user);
        } else {
            console.log("or")
            done(null, false);
            // or you could create a new account 
        }
    });
}));

var FacebookTokenStrategy = require('passport-facebook-token');


passport.use(new FacebookTokenStrategy({
    clientID: "1646221702363349",
    clientSecret: "37f7f6b13f8186e0add7739d43b4cc58"
  }, function(accessToken, refreshToken, profile, done) {

        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err){
                   
                    return done(err);
                }
                if (user) {
                    console.log("**found**"+user)
                    return done(null, user); // user found, return that user
                } else {
                    var newUser            = new User();
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    newUser.save(function(err,data) {
                        if (err){console.log(err)}
                            console.log("**new**"+data)
                        return done(null, user);
                    });
                }
            });



      // return done(null, profile);
    

      }
));