const Cinema = require('../models/cinema');

module.exports = {

	create(req, res, next) {

		const cinemaId = req.body.cinemaId;
		const number = req.body.number;
		const type = req.body.type;
		const capacity = req.body.capacity;

		Cinema.findOne({ _id: cinemaId })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					cinema.rooms.push({
						number: number,
						type: type,
						capacity: capacity,
						showings: []
					});

					cinema.save()
						.then(() => {
							res.status(200).send({ Message: 'Room added to Cinema successfully.' });
						}).catch(next);
				}
			}).catch(next);
	},

	update(req, res, next) {

		const id = req.params.id;
		const cinemaId = req.body.cinemaId;
		const number = req.body.number;
		const type = req.body.type;	
		const capacity = req.body.capacity;

		Cinema.findOne({ _id: cinemaId })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					var room = cinema.rooms.id(id);
					if (!room) {
						res.status(400).send({ Error: 'Room not found.' });
					} else {
						if (number !== null && number !== room.number) {
							room.number = number;
						}
						if (type !== null && type !== room.type) {
							room.type = type;
						}
						if (capacity !== null && capacity !== room.capacity) {
							room.capacity = capacity;
						}
						cinema.save()
							.then(() => {
								res.status(200).send({ Message: 'Room successfully updated.' });
							}).catch(next);
					}
				}
			}).catch(next);
	},

	delete(req, res, next) {

		Cinema.findOne({ _id: req.body.cinemaId })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					var room = cinema.rooms.id(req.params.id);
					if (!room) {
						res.status(400).send({ Error: 'Room not found.' });
					} else {
						room.remove();
						cinema.save()
							.then(() => {
								res.status(200).send({ Message: 'Room successfully deleted.' });
							}).catch(next);
					}
				}
			}).catch(next);
	},

	getById(req, res, next) {

		Cinema.findOne({ name: req.params.cinemaName })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					var room = cinema.rooms.id(req.params.id);
					if (!room) {
						res.status(400).send({ Error: 'Room not found.' });
					} else {
						res.status(200).send(room);
					}
				}
			}).catch(next);
	}
};