const {Router} = require('express');
const categoryRouter = Router();
const categoryController = require('../controllers/categoryController');
const protectRouter = require('../middlewares/protectRoutes');
const isAdmin = require('../middlewares/admin');

categoryRouter.get('/categories', 
  categoryController.getCategories);

categoryRouter.get('/categories/:slug', 
  categoryController.getCategoryBySlug);

categoryRouter.post('/categories', 
  protectRouter, 
  isAdmin, 
  categoryController.createCategory);

categoryRouter.put('/categories/:id',
  protectRouter, 
  isAdmin, 
  categoryController.updateCategory);

categoryRouter.delete('/categories/:id', 
  protectRouter,
  isAdmin, 
  categoryController.deleteCategory);

module.exports = categoryRouter;