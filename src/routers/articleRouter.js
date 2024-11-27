const { Router } = require('express');
const articleRouter = Router();
const articleController = require('../controllers/articleController');
const upload = require('../config/multer');
const handleMulterErrors = require('../middlewares/errors');
const protectRouter = require('../middlewares/protectRoutes');
const isAuthor = require('../middlewares/author');
const isAdmin = require('../middlewares/admin');

articleRouter.get('/articles', 
  articleController.getArticles
);

articleRouter.get('/articles/:id', 
  articleController.getArticleById
);

articleRouter.get('/articles/slug/:slug', 
  articleController.getArticleBySlug
);

articleRouter.put('/articles/:id', 
  protectRouter, 
  isAuthor,
  articleController.updateArticle
);

articleRouter.post('/articles',  
  protectRouter, 
  isAuthor,
  upload.single('file'), 
  handleMulterErrors, 
  articleController.createArticle
);

articleRouter.delete('/articles/:id',   
  protectRouter, 
  isAdmin, 
  articleController.deleteArticle
);

module.exports = articleRouter;
