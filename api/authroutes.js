const express = require('express');
const routes = express.Router();

const User = require('../controllers/user.controller');

routes.post('/login', User.login);
routes.post('/register', User.create);

routes.get('/user', User.get);
routes.get('/user/:username', User.getByName);
routes.delete('/user', User.delete);

module.exports = routes;