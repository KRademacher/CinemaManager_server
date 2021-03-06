const express = require('express');
const routes = express.Router();

const Cinema = require('../controllers/cinema.controller');
const Room = require('../controllers/room.controller');
const Showing = require('../controllers/showing.controller');

//Cinema routes
routes.post('/cinema', Cinema.create);
routes.get('/cinema', Cinema.get);
routes.get('/cinema/:name', Cinema.getByName);
routes.put('/cinema/:id', Cinema.update);
routes.delete('/cinema/:id', Cinema.delete);

//Room routes
routes.post('/room', Room.create);
routes.get('/room/:cinemaName/:id', Room.getById);
routes.put('/room/:id', Room.update);
routes.delete('/room/:id', Room.delete);

//Showing routes
routes.post('/showing', Showing.create);
routes.get('/showing/:name', Showing.get);
routes.get('/showing/:cinemaName/:roomId/:id', Showing.getById);
routes.get('/showing/:cinemaName/:title', Showing.getByName);
routes.put('/showing/:id', Showing.update);
routes.delete('/showing/:id', Showing.delete);

module.exports = routes;