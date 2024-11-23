const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const protectRouter = require('../middlewares/protectRoutes');
const isAdmin = require('../middlewares/admin');
const userAuthValidate = require('../validator/validUserAuth');
const currentUser = require('../middlewares/currentUser');

userRouter.get('/users', 
  protectRouter, 
  currentUser,
  isAdmin,  
  userController.getUsers);

userRouter.get('/users/:id',
  protectRouter, 
  currentUser, 
  userController.getUser);

userRouter.put('/users/:id',
  protectRouter, 
  currentUser, 
  userController.updateUser);

userRouter.post('/users',
  userAuthValidate,
  userController.createUser);

userRouter.delete('/users/:id', 
  protectRouter,
  currentUser,
  userController.deleteUser);

module.exports = userRouter;