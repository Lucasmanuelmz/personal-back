const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const protectRouter = require('../middlewares/protectRoutes');
const isAdmin = require('../middlewares/admin');
const userAuthValidate = require('../validator/validUserAuth');

userRouter.get('/users', 
  protectRouter, 
  isAdmin,  
  userController.getUsers);

userRouter.get('/users/:id',
  protectRouter, 
  userController.getUser);

userRouter.put('/users/:id',
  protectRouter, 
  userController.updateUser);

userRouter.post('/users',
  userAuthValidate,
  userController.createUser);

userRouter.delete('/users/:id', 
  protectRouter,
  userController.deleteUser);

module.exports = userRouter;