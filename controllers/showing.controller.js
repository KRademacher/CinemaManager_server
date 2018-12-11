const Cinema = require('../models/cinema');

module.exports = {

	create(req, res, next) {

		const cinemaId = req.body.cinemaId;
		const roomId = req.body.roomId;
		const movieTitle = req.body.movieTitle;
		const duration = req.body.duration;
		const startDate = req.body.startDate;

		Cinema.findOne({ _id: cinemaId})
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					var room = cinema.rooms.id(roomId);
					if (!room) {
						res.status(400).send({ Error: 'Room not found.' });
					} else {
						room.showings.push({
							movieTitle: movieTitle,
							duration: duration,
							startDate: startDate
						});

						room.save().then(() => {
							cinema.save().then(() => {
								res.status(200).send({ Message: 'Showing added to Room successfully.' });
							}).catch(next);
						}).catch(next);
					}
				}
			}).catch(next);
	},

	update(req, res, next) {

		const cinemaId = req.body.cinemaId;
		const roomId = req.body.roomId;
		const movieTitle = req.body.movieTitle;
		const duration = req.body.duration;
		const startDate = req.body.startDate;

		Cinema.findOne({ _id: cinemaId})
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					var room = cinema.rooms.id(roomId);
					if (!room) {
						res.status(400).send({ Error: 'Room not found.' });
					} else {
						var showing = room.showings.id(req.params.id);
						if (!showing) {
							res.status(400).send({ Error: 'Showing not found.' });
						} else {
							if (movieTitle !== null && movieTitle !== showing.movieTitle) {
								showing.movieTitle = movieTitle;
							}
							if (duration !== null && duration !== showing.duration) {
								showing.duration = duration;
							}
							if (startDate !== null && startDate !== showing.startDate) {
								showing.startDate = startDate;
							}
							room.save().then(() => {
								cinema.save().then(() => {
									res.status(200).send({ Message: 'Showing successfully updated.' });
								}).catch(next);
							}).catch(next);
						}
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
					var room = cinema.rooms.id(req.body.roomId);
					if (!room) {
						res.status(400).send({ Error: 'Room not found.' });
					} else {
						var showing = room.showings.id(req.params.id);
						if (!showing) {
							res.status(400).send({ Error: 'Showing not found.' });
						} else {
							showing.remove();
							room.save().then(() => {
								cinema.save().then(() => {
									res.status(200).send({ Message: 'Showing successfully deleted.' });
								}).catch(next);
							}).catch(next);
						}
					}
				}
			}).catch(next);
	},

	get(req, res, next) {
		Cinema.findOne({ _id: req.params.cinemaId })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					if (cinema.rooms.length > 0) {
						let results = [];
						for (let room of cinema.rooms) {
							if (room.showings.length > 0) {
								for (let showing of room.showings) {
									results.push({
										roomNumber: room.number,
										_id: showing._id,
										movieTitle: showing.movieTitle,
										duration: showing.duration,
										startDate: showing.startDate,
										endDate: showing.endDate
									});
								}
							}
						}
						res.status(200).send(results);
					}
				}
			}).catch(next);
	},

	getById(req, res, next) {

		Cinema.findOne({ _id: req.params.cinemaId })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					var room = cinema.rooms.id(req.params.roomId);
					if (!room) {
						res.status(400).send({ Error: 'Room not found.' });
					} else {
						var showing = room.showings.id(req.params.id);
						if (!showing) {
							res.status(400).send({ Error: 'Showing not found.' });
						} else {
							var result = {
								_id: showing._id,
								movieTitle: showing.movieTitle,
								duration: showing.duration,
								startDate: showing.startDate,
								endDate: showing.endDate
							};
							res.status(200).send(result);
						}
					}
				}
			}).catch(next);
	},

	getByName(req, res, next) {

		Cinema.findOne({ _id: req.params.cinemaId })
			.then((cinema) => {
				if (!cinema) {
					res.status(400).send({ Error: 'Cinema not found.' });
				} else {
					if (cinema.rooms.length > 0) {
						let results = [];
						for (let room of cinema.rooms) {
							if (room.showings.length > 0) {
								for (let showing of room.showings) {
									if (showing.movieTitle === req.params.title) {
										results.push({
											_id: room._id,
											number: room.number,
											type: room.type,
											capacity: room.capacity,
											showing: {
												_id: showing._id,
												movieTitle: showing.movieTitle,
												duration: showing.duration,
												startDate: showing.startDate,
												endDate: showing.endDate
											}
										});
									}
								}
							}
						}
						res.status(200).send(results);
					}
				}
			}).catch(next);
	}
};