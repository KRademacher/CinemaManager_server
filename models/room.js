const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showing = require('./showing');

const RoomSchema = new Schema({
	number: {
		type: Number,
		required: true
	},
	type: {
		type: String,
		enum: ['Standard', '3D', 'IMAX', 'IMAX 3D'],
		required: true
	},
	capacity: {
		type: Number,
		min: 1
	},
	showings: [showing]
});

module.exports = RoomSchema;