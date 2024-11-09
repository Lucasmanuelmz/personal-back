const {Router} = require('express');
const articleRouter = Router();
const articleController = require('../controllers/articleController');
const upload = require('../config/multer');
const handleMulterErrors = require('../middlewares/errors')

articleRouter.get('/articles/:page',
  articleController.getArticles );

articleRouter.get('/articles/id/:id', 
  articleController.getArticleById);

articleRouter.get('/articles/slug/:slug', 
  articleController.getArticleBySlug);

articleRouter.put('/articles/:id', 
  articleController.updateArticle);

articleRouter.post('/articles',
  upload.single('file'), 
  handleMulterErrors, 
  articleController.createArticle);

articleRouter.delete('/articles/:id', 
  articleController.deleteArticle)

module.exports = articleRouter;