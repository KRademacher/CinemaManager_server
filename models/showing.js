const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	},
	id: false
};

const ShowingSchema = new Schema({
	movieTitle: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		min: 1,
		required: true
	},
	startDate: {
		type: Date,
		required: true
	}
}, schemaOptions);

//Calculates when the movie will be finished by adding the duration minutes to the startdate.
ShowingSchema.virtual('endDate').get(function() {
	var endDate = new Date(this.startDate.getTime() + (this.duration * 60000));
	return endDate;
});

module.exports = ShowingSchema;