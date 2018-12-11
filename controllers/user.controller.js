const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {

	login(req, res) {
		passport.authenticate('local', { session: false }, (err, user, info) => {
			if (err || !user) {
				res.status(400).json(info);
			} else {
				req.login(user, { session: false }, (err) => {
					if (err) {
						console.log(err);
						res.status(400).json(err);
					} else {
						jwt.sign(
							{ username: user }, 
							'Pd9jtKwYYDQSuu7egoPIyziVpuahBZaJZI2YD3y9zlvZZAemZovwgRjVcgcNAtr', 
							{ expiresIn: '1d' }, 
							function(err, token) {
								res.status(200).json(token);
						});
					}
				});
			}
		})(req, res)
	},

	create(req, res, next) {
		const username = req.body.username;
		const password = req.body.password;

		User.findOne({ username: username })
			.then((result) => {
				if (!result) {
					var user = new User({ username: username, password: password });
					user.save()
						.then(() => {
							res.status(200).send({ Message: 'User successfully created.' });
						}).catch(next);
				} else {
					res.status(422).send({ Error: 'Username is already taken.' });
				}
			}).catch(next);
	},

	get(req, res, next) {
		User.find({})
			.then((users) =>{
				if (!users) {
					res.status(400).send({ Error: 'No users found.' });
				} else {
					res.status(200).send(users);
				}
			}).catch(next);
	},

	getByName(req, res, next) {
		const username = req.params.username;

		User.findOne({ username: username })
			.then((result) => {
				if (!result) {
					res.status(400).send({ Error: 'User not found.' });
				} else {
					res.status(200).send(result);
				}
			}).catch(next);
	},

	delete(req, res, next) {
		const username = req.body.username;
		const password = req.body.password;

		User.findOne({ username: username })
			.then((result) => {
				if (result) {
					if (result.checkPassword(password)) {
						result.delete()
							.then(() => {
								res.status(200).send({ Message: 'User successfully deleted.' });
							}).catch(next);
					} else {
						res.status(400).send({ Error: 'Password did not match.' });
					}
				} else {
					res.status(400).send({ Error: 'User not found.' });
				}
			}).catch(next);
	}
};