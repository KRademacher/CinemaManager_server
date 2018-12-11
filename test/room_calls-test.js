const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiString = require('chai-string');
const server = require('../server');
const chould = chai.should();
const mongoose = require('mongoose');

chai.use(chaiHttp);
chai.use(chaiString);

describe('room API functionalities', function() {

	var token;
	var cinemaId;
	var roomId;

	before(function(done) {

		mongoose.Promise = global.Promise;
		mongoose.set('useFindAndModify', false);
		mongoose.set('useNewUrlParser', true);
		mongoose.set('useCreateIndex', true);
		mongoose.connect('mongodb://admin:admin12345@ds231374.mlab.com:31374/cinema_test');

		let user = {
			'username': 'test',
			'password': 'test'
		};

		let cinema = {
			'name': 'RoomCinema'
		};

		//Get the token, create the cinema, and get the id.
		//No shoulds as these are tested in different test files.
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
								cinemaId = result.body[0]._id;

								done();
							});
					});
			});
	});

	it('should not make any calls without authorization', function(done) {
		let room = {
			'cinemaId': cinemaId,
			'number': 1,
			'type': 'Standard',
			'capacity': 100
		};

		chai.request(server)
			.post('/api/room')
			.send(room)
			.end(function(error, result) {
				error.should.have.status(401);
				error.rawResponse.should.equal('Unauthorized');
				done();
			});
	});

	it('should add a room to a cinema', function(done) {
		let room = {
			'cinemaId': cinemaId,
			'number': 1,
			'type': 'Standard',
			'capacity': 100
		};

		chai.request(server)
			.post('/api/room')
			.set('Authorization', token)
			.send(room)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Room added to Cinema successfully.');
				done();
			});
	});

	it('should not add a room with invalid type', function(done) {
		let room = {
			'cinemaId': cinemaId,
			'number': 1,
			'type': '5D',
			'capacity': 100
		};

		chai.request(server)
			.post('/api/room')
			.set('Authorization', token)
			.send(room)
			.end(function(error, result) {
				result.should.have.status(404);
				result.should.be.json;
				result.body.should.have.property('error');
				result.body.error.message.should.equal(
					'cinema validation failed: rooms.1.type: `5D` is not a valid enum value for path `type`.');
				done();
			});
	});

	it('should get a room by id', function(done) {
		chai.request(server)
			.get(`/api/cinema/${cinemaId}`)
			.set('Authorization', token)
			.end(function(error, result) {
				roomId = result.body.rooms[0]._id;

				chai.request(server)
					.get(`/api/room/${cinemaId}/${roomId}`)
					.set('Authorization', token)
					.end(function(error, result) {
						result.should.have.status(200);
						result.should.be.json;
						result.body.should.have.property('number');
						result.body.should.have.property('type');
						result.body.should.have.property('capacity');
						result.body.should.have.property('showings');
						result.body.number.should.equal(1);
						result.body.type.should.equal('Standard');
						result.body.capacity.should.equal(100);
						result.body.showings.should.be.an('array');
						done();
					});
			});
	});

	it('should update an existing room', function(done) {
		let body = {
			'cinemaId': cinemaId,
			'number': 5,
			'type': 'Standard',
			'capacity': 100
		};

		chai.request(server)
			.put(`/api/room/${roomId}`)
			.set('Authorization', token)
			.send(body)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Room successfully updated.');

				chai.request(server)
					.get(`/api/room/${cinemaId}/${roomId}`)
					.set('Authorization', token)
					.end(function(error, result) {
						result.body.number.should.equal(5);
						done();
					});
			});
	});

	it('should delete a room', function(done) {
		chai.request(server)
			.delete(`/api/room/${roomId}`)
			.set('Authorization', token)
			.send({ 'cinemaId': cinemaId })
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Room successfully deleted.');

				chai.request(server)
					.get(`/api/room/${cinemaId}/${roomId}`)
					.set('Authorization', token)
					.end(function(error, result) {
						result.should.have.status(400);
						result.body.should.have.property('Error');
						result.body.Error.should.equal('Room not found.');
						done();
					});
			});
	});

	//Delete the cinema, as it's no longer necessary.
	after(function(done) {
		chai.request(server)
			.delete(`/api/cinema/${cinemaId}`)
			.set('Authorization', token)
			.end(function(error,result) {
				result.should.have.status(200);
				done();
			});
	})
});