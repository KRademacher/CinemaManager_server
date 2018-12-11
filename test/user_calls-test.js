process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiString = require('chai-string');
var server = require('../server');
var chould = chai.should();

chai.use(chaiHttp);
chai.use(chaiString);

describe('user API functionalities', function() {

	it('should register a new user', function(done) {
		let user = {
			'username': 'testuser',
			'password': '12345'
		};

		chai.request(server)
			.post('/api/register')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('User successfully created.');
				done();
			});
	});

	it('should not register an already existing user', function(done) {
		let user = {
			'username': 'testuser',
			'password': '12345'
		};

		chai.request(server)
			.post('/api/register')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(422);
				result.should.be.json;
				result.body.should.have.property('Error');
				result.body.Error.should.equal('Username is already taken.');
				done();
			});
	});

	it('should not register a user without username', function(done) {
		let user = {
			'username': '',
			'password': 'nousername'
		};

		chai.request(server)
			.post('/api/register')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(404);
				result.should.be.json;
				result.body.should.have.property('error');
				result.body.error.errors.username.message.should.equal('Path `username` is required.');
				done();
			});
	});

	it('should not register a user without password', function(done) {
		let user = {
			'username': 'nopassword',
			'password': ''
		};

		chai.request(server)
			.post('/api/register')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(404);
				result.should.be.json;
				result.body.should.have.property('error');
				result.body.error.errors.password.message.should.equal('Path `password` is required.');
				done();
			});
	});

	it('should login a user with the correct credentials and give back a token', function(done) {
		let user = {
			'username': 'testuser',
			'password': '12345'
		};

		chai.request(server)
			.post('/api/login')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.a.string;
				result.body.should.be.a.lengthOf(157);
				result.body.should.startWith('ey');
				done();	
			});
	});

	it('should not login a user with incorrect credentials', function(done) {
		let user = {
			'username': 'testuser',
			'password': '54321'
		};

		chai.request(server)
			.post('/api/login')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(400);
				result.should.be.json;
				result.body.should.have.property('Error');
				result.body.Error.should.equal('Incorrect credentials');
				done();
			});
	});

	it('should not delete user with incorrect password', function(done) {
		let user = {
			'username': 'testuser',
			'password': '54321'
		};

		chai.request(server)
			.delete('/api/user')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(400);
				result.should.be.json;
				result.body.should.have.property('Error');
				result.body.Error.should.equal('Password did not match.');
				done();
			});
	});

	it('should successfully delete a user', function(done) {
		let user = {
			'username': 'testuser',
			'password': '12345'
		};

		chai.request(server)
			.delete('/api/user')
			.send(user)
			.end(function(error, result) {
				result.should.have.status(200);
				result.should.be.json;
				result.body.should.have.property('Message');
				result.body.Message.should.equal('User successfully deleted.');
				done();
			});
	});
});