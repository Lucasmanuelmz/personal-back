const {Router} = require('express');
const categoryRouter = Router();

const categoryController = require('../controllers/categoryController');
const protectRouter = require('../middlewares/protectRoutes');
const isAdmin = require('../middlewares/admin');
const currentUser = require('../middlewares/currentUser');

categoryRouter.get('/categories', 
  categoryController.getCategories);

categoryRouter.get('/categories/:slug', 
  categoryController.getCategoryBySlug);

categoryRouter.post('/categories', 
  protectRouter, 
  currentUser, 
  isAdmin, 
  categoryController.createCategory);

categoryRouter.put('/categories/:id',
  protectRouter, 
  currentUser,
  isAdmin, 
  categoryController.updateCategory);

categoryRouter.delete('/categories/:id', 
  protectRouter,
  currentUser,
  isAdmin, 
  categoryController.deleteCategory);

module.exports = categoryRouter;