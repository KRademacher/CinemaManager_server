var config = {};

config.mongoURI = {
	//development: 'mongodb://localhost/cinema',
  development: 'mongodb://admin:admin12345@ds231374.mlab.com:31374/cinema',
  //test: 'mongodb://localhost/cinema_test'
  test: 'mongodb://admin:admin12345@ds231374.mlab.com:31374/cinema_test'
};

module.exports = config;