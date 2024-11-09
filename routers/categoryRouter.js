const {Router} = require('express');
const categoryRouter = Router();

const categoryController = require('../controllers/categoryController');

categoryRouter.get('/categories', categoryController.getCategories);
categoryRouter.get('/categories/:slug', categoryController.getCategoryBySlug);
categoryRouter.post('/categories', categoryController.createCategory);
categoryRouter.put('/categories/:id', categoryController.updateCategory);
categoryRouter.delete('/categories/:id', categoryController.deleteCategory);

module.exports = categoryRouter;