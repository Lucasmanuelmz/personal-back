const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.get('/users', userController.getUsers);
userRouter.get('/users/:id', userController.getUser);
userRouter.post('/users', userController.createUser);
userRouter.delete('/users/:id', userController.deleteUser);

module.exports = userRouter;