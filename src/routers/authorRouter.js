const express = require('express');
const authorRoutes = express.Router();
const authorController = require('../controllers/authorControlls');
const protectRouter = require('../middlewares/protectRoutes');
const isAdmin = require('../middlewares/admin');
const isAuthor = require('../middlewares/author');

authorRoutes.post('/authors/:id', 
  protectRouter, 
  authorController.createAuthor);

authorRoutes.get('/authors', 
  protectRouter, 
  isAdmin, 
  authorController.getAuthors);

authorRoutes.get('/authors/:id', 
  protectRouter, 
  isAuthor, 
  authorController.getAuthorById);

authorRoutes.put('/authors/:id',
  protectRouter, 
  isAuthor, 
  authorController.updateAuthor);

authorRoutes.delete('/authors/:id', 
  protectRouter, 
  isAdmin, 
  authorController.deleteAuthor);
  
module.exports = authorRoutes;