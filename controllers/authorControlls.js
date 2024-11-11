const {validationResult} = require('express-validator');
const Author = require("../models/authorModel");
const validateAuthor = require('../validator/validateAuthor');
const validateUpdateAuthor = require("../validator/validateUpdateAuthor");

exports.createAuthor = [validateAuthor, (req, res) => {
  const { firstname, lastname, bio } = req.body;

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  Author.create({
    firstname,
    lastname,
    bio,
  })
    .then(() => {
      res.status(201).json({ msg: 'Parabéns, a sua conta de autor foi criada com sucesso!' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor: não foi possível criar a conta de autor. Tente mais tarde.' });
    });
}];

exports.getAuthors = (req, res) => {
  Author.findAll()
    .then((authors) => {
      if (!authors || authors.length === 0) {
        return res.status(404).json({ msg: 'Lamentamos, não encontramos autores registrados.' });
      }
      res.status(200).json({ authors });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor ao buscar autores.' });
    });
};

exports.getAuthorById = (req, res) => {
  const { id } = req.params;

  Author.findByPk(id)
    .then((author) => {
      if (!author) {
        return res.status(404).json({ msg: 'Autor não encontrado no banco de dados.' });
      }
      res.status(200).json({ author });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor ao buscar autor.' });
    });
};

exports.updateAuthor =[validateUpdateAuthor, (req, res) => {
  const { firstname, lastname, bio } = req.body;
  const { id } = req.params;
 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  Author.update(
    { firstname, lastname, bio },
    { where: { id } }
  )
    .then((rowsUpdated) => {
      if (rowsUpdated[0] === 0) {
        return res.status(404).json({ msg: 'Autor não encontrado para atualização.' });
      }
      res.status(200).json({ msg: 'Dados do autor atualizados com sucesso!' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor ao atualizar autor.' });
    });
}];

exports.deleteAuthor = (req, res) => {
  const { id } = req.params;

  Author.destroy({ where: { id } })
    .then((deleted) => {
      if (deleted === 0) {
        return res.status(404).json({ msg: 'Autor não encontrado para deleção.' });
      }
      res.status(200).json({ msg: 'Conta de autor deletada com sucesso.' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor ao deletar conta de autor.' });
    });
};
