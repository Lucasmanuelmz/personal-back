const {Router} = require('express');
const categoryRouter = Router();

const categoryController = require('../controllers/categoryController');
const protectRouter = require('../middlewares/protectRoutes');
const isAdmin = require('../middlewares/admin');

categoryRouter.get('articles/categories', 
  categoryController.getCategories);

categoryRouter.get('articles/categories/:slug', 
  categoryController.getCategoryBySlug);

categoryRouter.post('articles/categories', 
  protectRouter, 
  isAdmin, 
  categoryController.createCategory);

categoryRouter.put('articles/categories/:id', 
  protectRouter, 
  isAdmin, 
  categoryController.updateCategory);

categoryRouter.delete('articles/categories/:id', 
  protectRouter, 
  isAdmin, 
  categoryController.deleteCategory);

module.exports = categoryRouter;