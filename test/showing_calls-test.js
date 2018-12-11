const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiString = require('chai-string');
const server = require('../server');
const chould = chai.should();
const mongoose = require('mongoose');

chai.use(chaiHttp);
chai.use(chaiString);

before(function(done) {
	mongoose.Promise = global.Promise;
	mongoose.set('useFindAndModify', false);
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useCreateIndex', true);
	mongoose.connect('mongodb://admin:admin12345@ds231374.mlab.com:31374/cinema_test', done);
});

describe('showing API functionalities', function() {

	var token;
	var cinemaId;
	var roomId;
	var showingId;

	var date = new Date(Date.now());

	before(function(done) {

		let user = {
			'username': 'test',
			'password': 'test'
		};

		let cinema = {
			'name': 'RoomCinema'
		};

		let room = {
			'cinemaId': cinemaId,
			'number': 1,
			'type': 'Standard',
			'capacity': 100
		};

		//Login user and get token.
		//Create cinema and get cinemaId;
		//Create room and get roomId;
		chai.request(server)
			.post('/api/login')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(200);
				token = 'Bearer ' + result.body;

				chai.request(server)
					.post('/api/cinema')
					.set('Authorization', token)
					.send(cinema)
					.end(function(error, result) {
						result.should.have.status(200);

						chai.request(server)
							.get('/api/cinema')
							.set('Authorization', token)
							.end(function(error, result) {
								result.should.have.status(200);
								cinemaId = result.body[0]._id;

								chai.request(server)
									.post('/api/room')
									.set('Authorization', token)
									.send({
										'cinemaId': cinemaId,
										'number': room.number,
										'type': room.type,
										'capacity': room.capacity
									})
									.end(function(error, result) {
										result.should.have.status(200);

										chai.request(server)
											.get(`/api/cinema/${cinemaId}`)
											.set('Authorization', token)
											.end(function(error, result) {
												result.should.have.status(200);
												roomId = result.body.rooms[0]._id;

												done();
											});
									});
							});
					});
			});
	});

	it('should not make any calls without authorization', function(done) {
		let showing = {
			'cinemaId': cinemaId,
			'roomId': roomId,
			'movieTitle': 'Shrek',
			'duration': 85,
			'startDate': new Date(Date.now())
		};

		chai.request(server)
			.post('/api/showing')
			.send(showing)
			.end(function(error, result) {
				error.should.have.status(401);
				error.rawResponse.should.equal('Unauthorized');
				done();
			});
	});

	it('should add a showing to a room', function(done) {
		let showing = {
			'cinemaId': cinemaId,
			'roomId': roomId,
			'movieTitle': 'Shrek',
			'duration': 85,
			'startDate': new Date(Date.now())
		};

		chai.request(server)
			.post('/api/showing')
			.set('Authorization', token)
			.send(showing)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Showing added to Room successfully.');
				done();
			});
	});

	it('should not add a showing without title', function(done) {
		let showing = {
			'cinemaId': cinemaId,
			'roomId': roomId,
			'movieTitle': '',
			'duration': 85,
			'startDate': date
		};

		chai.request(server)
			.post('/api/showing')
			.set('Authorization', token)
			.send(showing)
			.end(function(error, result) {
				result.should.have.status(404);
				result.should.be.json;
				result.body.should.have.property('error');
				result.body.error.message.should.equal(
					'cinema validation failed: rooms.0.showings.1.movieTitle: Path `movieTitle` is required.');
				done();
			});
	});

	it('should get all showings', function(done) {
		chai.request(server)
			.get(`/api/showing/${cinemaId}`)
			.set('Authorization', token)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.be.an('array');
				result.body[0].should.have.property('_id');
				result.body[0].should.have.property('roomNumber');
				result.body[0].should.have.property('movieTitle');
				result.body[0].should.have.property('duration');
				result.body[0].should.have.property('startDate');
				result.body[0].should.have.property('endDate');
				result.body[0].movieTitle.should.equal('Shrek');
				result.body[0].duration.should.equal(85);

				showingId = result.body[0]._id;
				done();
			});
	});

	it('should get a showing by id', function(done) {
		chai.request(server)
			.get(`/api/showing/${cinemaId}/${roomId}/${showingId}`)
			.set('Authorization', token)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('_id');
				result.body.should.have.property('movieTitle');
				result.body.should.have.property('duration');
				result.body.should.have.property('startDate');
				result.body.should.have.property('endDate');
				result.body.movieTitle.should.equal('Shrek');
				result.body.duration.should.equal(85);
				done();
			});
	});

	it('should update a showing', function(done) {
		let showing = {
			'cinemaId': cinemaId,
			'roomId': roomId,
			'movieTitle': 'Titanic',
			'duration': 85,
			'startDate': date
		}

		chai.request(server)
			.put( `/api/showing/${showingId}`)
			.set('Authorization', token)
			.send(showing)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Showing successfully updated.');

				chai.request(server)
					.get(`/api/showing/${cinemaId}/${roomId}/${showingId}`)
					.set('Authorization', token)
					.end(function(error, result) {
						result.should.have.status(200);
						result.body.movieTitle.should.equal('Titanic');
						done();
					});
			});
	});

	it('should delete a showing', function(done) {
		chai.request(server)
			.delete(`/api/showing/${showingId}`)
			.set('Authorization', token)
			.send({
				'cinemaId': cinemaId,
				'roomId': roomId
			})
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Showing successfully deleted.');

				chai.request(server)
					.get(`/api/showing/${cinemaId}/${roomId}/${showingId}`)
					.set('Authorization', token)
					.end(function(error, result) {
						result.should.have.status(400);
						result.body.should.have.property('Error');
						result.body.Error.should.equal('Showing not found.');
						done();
					});
			});
	});

	//Delete the cinema, as it's no longer necessary.
	after(function(done) {
		chai.request(server)
			.delete(`/api/cinema/${cinemaId}`)
			.set('Authorization', token)
			.end(function(error, result) {
				result.should.have.status(200);
				done();
			});
	});
});