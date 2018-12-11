const User = require('../models/user');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, function(username, password, cb) {
	User.findOne({ username: username })
		.then((user) => {
			if (!user || !user.checkPassword(password)) {
				return cb(null, false, { Error: 'Incorrect credentials' });
			} else {
				return cb(null, user.username);
			}
		}).catch(err => cb(err));
}));

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'Pd9jtKwYYDQSuu7egoPIyziVpuahBZaJZI2YD3y9zlvZZAemZovwgRjVcgcNAtr'
}, function(jwtPayload, cb) {
	return User.findOne({ username: jwtPayload.username })
		.then((user) => {
			return cb(null, user)
		}).catch((err) => { 
			return cb(err);
		});
}));