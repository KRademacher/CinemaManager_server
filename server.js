const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport =  require('passport');

const config = require('./config');
const routes = require('./api/routes');
const authroutes = require('./api/authroutes');

const app = express();
const port = process.env.PORT || 3000;

require('./auth/passport')

app.use('*', function(req, res, next){
	res.contentType('application/json');
	next();
});

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(cors());

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongoURI[process.env.NODE_ENV], function(error, result) {
	if (error) {
		console.log('Error connecting to the database. ' + err);
	} else {
		console.log('Connected to database: ' + config.mongoURI[app.settings.env]);
	}
});

app.use('/api', authroutes);
app.use('/api', passport.authenticate('jwt', { session: false }), routes);

app.use('*', function(err, req, res, next) {
	//console.log('Error: ' + err);
	res.status(404).json({ error: err }).end();
});

app.listen(port, function() {
	console.log('Server listens on port ' + port);
});

module.exports = app;