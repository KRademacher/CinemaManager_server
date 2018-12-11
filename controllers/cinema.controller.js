const Cinema = require('../models/cinema');

module.exports = {

	create(req, res, next) {
		const name = req.body.name;

		Cinema.findOne({ name: name })
			.then((cinema) => {
				if (cinema) {
					res.status(422).send({ Error: 'Name already exists.' });
				} else {
					let cinema = new Cinema({
						name: name,
						rooms: []
					});
					cinema.save()
						.then(() => {
							res.status(200).send({ Message: 'Cinema successfully created.' });
						}).catch(next);
				}
			}).catch(next);
	},

	update(req, res, next) {

		Cinema.findOne({ _id: req.params.id })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.'});
				} else {
					Cinema.findByIdAndUpdate({ _id: cinema._id }, { name: req.body.name })
						.then(() => {
							res.status(200).send({ Message: 'Cinema updated successfully.' });
						}).catch(next);
				}
			}).catch(next);
	},

	delete(req, res, next) {

		Cinema.findOne({ _id: req.params.id })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					cinema.delete()
						.then(() => {
							res.status(200).send({ Message: 'Cinema successfully deleted.' });
						}).catch(next);
				}
			}).catch(next);
	},

	get(req, res, next) {

		Cinema.find({})
			.then((cinemas) => {
				if (!cinemas) {
					res.status(400).send({ Error: 'No cinemas found.' });
				} else {
					res.status(200).send(cinemas);
				}
			}).catch(next);
	},

	getById(req, res, next) {

		Cinema.findOne({ _id: req.params.id })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					res.status(200).send(cinema);
				}
			}).catch(next);
	},

	getByName(req, res, next) {

		Cinema.findOne({ name: req.body.name })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					res.status(200).send(cinema);
				}
			}).catch(next);
	}
};