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

describe('cinema API functionalities', function() {

	var token;
	var cinemaId;

	before(function(done) {

		let user = {
			'username': 'test',
			'password': 'test'
		};

		chai.request(server)
			.post('/api/login')
			.send(user)
			.end(function(error, result) {
				token = 'Bearer ' + result.body;
				done();
			});
	});

	it('should not make any calls without authorization', function(done) {
		let cinema = {
			'name': 'Testcinema'
		};

		chai.request(server)
			.post('/api/cinema')
			.send(cinema)
			.end(function(error, result) {
				error.should.have.status(401);
				error.rawResponse.should.equal('Unauthorized');
				done();
			});
	});

	it('should add a new cinema', function(done) {
		let cinema = {
			'name': 'Testcinema'
		};

		chai.request(server)
			.post('/api/cinema')
			.set('Authorization', token)
			.send(cinema)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Cinema successfully created.');
				done();
			});
	});

	it('should not add an already existing cinema', function(done) {
		let cinema = {
			'name': 'Testcinema'
		};

		chai.request(server)
			.post('/api/cinema')
			.set('Authorization', token)
			.send(cinema)
			.end(function(error, result) {
				result.should.have.status(422);
				result.should.be.json;
				result.body.should.have.property('Error');
				result.body.Error.should.equal('Name already exists.');
				done();
			});
	});

	it('should not add a new cinema with an empty name', function(done) {
		let cinema = {
			'name': ''
		};

		chai.request(server)
			.post('/api/cinema')
			.set('Authorization', token)
			.send(cinema)
			.end(function(error, result) {
				result.should.have.status(404);
				result.should.be.json;
				result.body.should.have.property('error');
				result.body.error.message.should.equal('cinema validation failed: name: Path `name` is required.');
				done();
			});
	});

	it('should get all cinemas', function(done) {
		chai.request(server)
			.get('/api/cinema')
			.set('Authorization', token)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.be.an('array');
				result.body[0].should.have.property('_id');
				result.body[0].should.have.property('name');
				result.body[0].should.have.property('rooms');
				result.body[0].name.should.equal('Testcinema');
				result.body[0].rooms.should.be.an('array');

				cinemaId = result.body[0]._id;

				done();
			});
	});

	it('should get one cinema with the given id', function(done) {
		chai.request(server)
			.get(`/api/cinema/${cinemaId}`)
			.set('Authorization', token)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('_id');
				result.body.should.have.property('name');
				result.body.should.have.property('rooms');
				result.body.name.should.equal('Testcinema');
				result.body.rooms.should.be.an('array');
				done();
			});
	});

	it('should update a cinema with the new values', function(done) {
		chai.request(server)
			.put(`/api/cinema/${cinemaId}`)
			.set('Authorization', token)
			.send({ 'name': 'cinemaTest' })
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Cinema updated successfully.');

				chai.request(server)
					.get(`/api/cinema/${cinemaId}`)
					.set('Authorization', token)
					.end(function(error, result) {
						result.should.have.status(200);
						result.body.name.should.equal('cinemaTest');
						done();
					});
			});
	});

	it('should delete a cinema', function(done) {
		chai.request(server)
			.delete(`/api/cinema/${cinemaId}`)
			.set('Authorization', token)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('Cinema successfully deleted.');

				chai.request(server)
					.get(`/api/cinema/${cinemaId}`)
					.set('Authorization', token)
					.end(function(error, result) {
						result.should.have.status(400);
						result.body.should.have.property('Error');
						result.body.Error.should.equal('Cinema not found.');
						done();
					});
			});
	});
});