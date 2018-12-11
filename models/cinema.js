const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const room = require('./room');

const CinemaSchema = new Schema({
	name: { 
		type: String, 
		required: true,
		unique: true 
	},
	rooms: {
		type: [room],
		sparse: true
	}
});

const Cinema = mongoose.model('cinema', CinemaSchema);
module.exports = Cinema;