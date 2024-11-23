const express = require('express');
const authorRoutes = express.Router();
const authorController = require('../controllers/authorControlls');
const protectRouter = require('../middlewares/protectRoutes');
const isAdmin = require('../middlewares/admin');
const isAuthor = require('../middlewares/author');
const currentUser = require('../middlewares/currentUser');

authorRoutes.post('/authors/:id',  
  protectRouter, 
  currentUser, 
  authorController.createAuthor);

authorRoutes.get('/authors',
  protectRouter, 
  currentUser, 
  isAdmin, 
  authorController.getAuthors);

authorRoutes.get('/authors/:id',
  protectRouter, 
  currentUser,
  isAuthor, 
  authorController.getAuthorById);

authorRoutes.put('/authors/:id',
  protectRouter, 
  currentUser,
  isAuthor, 
  authorController.updateAuthor);

authorRoutes.delete('/authors/:id', 
  protectRouter,  
  currentUser,
  isAdmin, 
  authorController.deleteAuthor);
  
module.exports = authorRoutes;