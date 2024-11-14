const Article = require('../models/postModel');
const Category = require('../models/categoryModel');
require('dotenv').config();
const slugify = require('slugify');
const articleValidate = require('../validator/articleValidate');
const { validationResult } = require('express-validator');
const validateUpdateArticle = require('../validator/validateUpdateArticle');
const baseUrl = process.env.BASE_URL;

exports.getArticles = (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * 9;
  Article.findAndCountAll({
    include: { model: Category },
    limit: 9, 
    offset: offset
  })
  .then(articles => {
    const next = (offset + 9) < articles.count; 

    const result = {
      next: next,
      articles: articles.rows 
    };
    res.status(200).json(result);
  })
  .catch(error => {
    console.error(error); 
    res.status(500).json({ error: 'Erro ao obter os artigos', detail: error.message });
  });
};

exports.getArticleById = (req, res) => {
  const {id} = req.params;
  Article.findByPk(id)
  .then(article => {
    res.status(200).json({article});
  })
  .catch(error => {
    res.status(500).json({error: 'Erro ao obter os artigos', detail: error.message});
  })
}

exports.getArticleBySlug = (req, res) => {
  const { slug } = req.params;

  Article.findOne({
    where: { slug: slug },
    include: { model: Category }
  })
  .then(article => {
    if (!article) {
      console.log('Artigo não encontrado para o slug: ' + slug);
      return res.status(404).json({ error: 'Artigo não encontrado' });
    }
    console.log('Consegui receber o artigo: ', article);
    res.status(200).json({ article });
  })
  .catch(error => {
    console.error('Erro ao obter o artigo:', error.message);
    res.status(500).json({ error: 'Erro ao obter o artigo', detail: error.message });
  });
};

exports.createArticle = [articleValidate, (req, res) => {

  const {title, description, article, categoryId} = req.body;
  const url = req.file? `${baseUrl}/uploads/${req.file.filename}`: null;

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  Article.create({
    title: title,
    slug: slugify(title),
    description: description,
    categoryId: categoryId,
    url: url,
    article: article 
  })
  .then(() => {
  res.status(201).json({msg: 'Artigo criado com sucesso'})
  })
 .catch(error => {
  res.status(400).json({error: 'Não foi possível criar o artigo', detail: error.message})
 })
}];

exports.updateArticle =[validateUpdateArticle, (req, res) => {
  const {title, description, article, id} = req.body;

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  Article.update({
    title,
    description,
    article,
  }, {
    where: {id: id}
  })
  .then(() => {
    res.status(200).json({msg: 'Artigo atualizado com sucesso!'})
  })
  .catch(error => {
    res.status(400).json({error: 'Tivemos problemas ao atualizar o artigo', detail: error.message})
  })
}];

exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  Article.findByPk(id)
    .then(article => {
      if (!article) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }
      return Article.destroy({ where: { id: id } });
    })
    .then(() => {
      res.status(200).json({ msg: 'Artigo apagado com sucesso' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao apagar o artigo', detail: error.message });
    });
};
