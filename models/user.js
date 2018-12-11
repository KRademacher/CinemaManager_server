const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String,
		required: true
	}
});

UserSchema.pre('save', function(next) {
	const hash = crypto.createHash('sha256').update(this.password).digest('hex');
	this.password = hash;
	next();
});

UserSchema.methods.checkPassword = function(password) {
	const hash = crypto.createHash('sha256').update(password).digest('hex');
	if (this.password === hash) {
		return true;
	} else {
		return false;
	}
};

const User = mongoose.model('user', UserSchema);
module.exports = User;