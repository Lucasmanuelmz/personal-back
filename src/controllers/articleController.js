const Article = require('../models/postModel');
const Category = require('../models/categoryModel');
const Author = require('../models/authorModel');
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
    include: [{ model: Category }, {model: Author}],
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
  Article.findByPk(id, { include: [{ model: Category }, { model: Author }] })
  .then(article => {
    const response = {
      article,
      links: [
        {
          href: `https://api.devlucas.icu/articles`,
          rel: 'get-all',
          method: 'GET',
        },
        {
          href: `https://api.devlucas.icu/articles`,
          rel: 'create',
          method: 'POST',
        },
        {
          href: `https://api.devlucas.icu/articles/${id}`,
          rel: 'update',
          method: 'UPDATE',
        },
        {
          href: `https://api.devlucas.icu/articles/${id}`,
          rel: 'delete',
          method: 'DELETE',
        },
      ]
    }
    res.status(200).json({response});
  })
  .catch(error => {
    res.status(500).json({error: 'Erro ao obter os artigos', detail: error.message});
  })
}

exports.getArticleBySlug = (req, res) => {
  const { slug } = req.params;

  Article.findOne({
    where: { slug },
    include: [{ model: Category }, { model: Author }]
  })
    .then(article => {
      if (!article) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      Article.findAll({
        where: {
          categoryId: article.categoryId,
          id: { [Op.ne]: article.id } 
        },
        limit: 6,
        order: [['id', 'ASC']]
      })
        .then(relatedArticles => {
          const links = relatedArticles.map(related => ({
            rel: 'related',
            href: `https://api.devlucas.icu/articles/${related.slug}`
          }));

          res.status(200).json({
            article,
            links
          });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter o artigo', detail: error.message });
    });
};


exports.createArticle = [articleValidate, (req, res) => {

  const {title, description, article, categoryId, authorId} = req.body;
  const url = req.file? `${baseUrl}/uploads/${req.file.filename}`: null;

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const slug = slugify(title, { lower: true });

  Article.findOne({ where: { slug } })
  .then(existingArticle => {

    if (existingArticle) {
      return res.status(400).json({ error: 'Título já em uso, escolha outro' });
    }

  Article.create({
    title: title,
    slug: slug,
    description: description,
    categoryId: categoryId,
    url: url,
    authorId,
    article: article 
  })
  .then(() => {
  res.status(201).json({msg: 'Artigo criado com sucesso'})
  })
 .catch(error => {
  res.status(400).json({error: 'Não foi possível criar o artigo', detail: error.message})
 })
})
.catch(error => {
  return res.status(500).json({message: 'Erro no banco de dados '+error.message})
})
}];

exports.updateArticle =[validateUpdateArticle, (req, res) => {
  const {title, description, article} = req.body;
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID inválido fornecido' });
  }

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
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID inválido fornecido' });
  }
  Article.findByPk(id)
    .then(article => {
      if (!article) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }
      return Article.destroy({ where: { id: id }, individualHooks: true });
    })
    .then(() => {
      res.status(200).json({ msg: 'Artigo apagado com sucesso' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao apagar o artigo', detail: error.message });
    });
};
