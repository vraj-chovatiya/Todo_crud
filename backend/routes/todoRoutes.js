const express = require('express');
const routes = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../utils/auth');

routes.use(auth); // Apply auth middleware to all routes

routes.post('/', todoController.createTodo);
routes.get('/', todoController.getTodos);
routes.put('/:id', todoController.updateTodo);
routes.delete('/:id', todoController.deleteTodo);

module.exports = routes;