const Category = require('../models/categoryModel');
const slugify = require('slugify');
  const Article = require('../models/postModel');

exports.getCategories = (req, res) => {
  Category.findAll({include: Article})

  .then(categories => {
    res.status(200).json({categories})
  })

  .catch(error => {
    res.status(500).json({error: 'Erro ao obter as categorias', detail: error.message})
  })
}

exports.getCategoryBySlug = (req, res) => {
  const { slug } = req.params;

  Category.findOne({ where: {slug} })
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      return Article.findAll({ where: { categoryId: category.id } })
        .then(articles => {
          const categoryData = category.toJSON();
          const articlesData = articles.map(article => article.toJSON());
          res.status(200).json({ articles: articlesData, category: categoryData });
        });
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao obter a categoria ou os artigos', detail: error.message });
    });
};

exports.createCategory = (req, res) => {
  const {name} = req.body;
  Category.create({
    name,
    slug: slugify(name)
  })
  .then(() => {
  res.status(201).json({msg: 'Categoria criada com sucesso'})
  })
 .catch(error => {
  res.status(400).json({error: 'Não foi possível criar a categoria', detail: error.message})
 })
}

exports.updateCategory = (req, res) => {
  const {name} = req.body;
  Category.update({
    name
  }, {
    where: {id: id}
  })
  .then(() => {
    res.status(200).json({msg: 'categoria atualizado com sucesso!'})
  })
  .catch(error => {
    res.status(400).json({error: 'Tivemos problemas ao atualizar a categoria', detail: error.message})
  })
}

exports.deleteCategory =(req, res) => {
  const {id} = req.params;
  Category.destroy({where: {id: id}})
  .then(() => {
    res.status(200).json({msg: 'Categoria apagada com sucesso'})
  })
  .catch(error => {
    res.status(500).json({error: 'Erro ao apagar a categoria, tente novamente mais tarde'})
  })
}