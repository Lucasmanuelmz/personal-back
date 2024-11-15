const User = require('../models/userModel');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getUsers = (req, res) => {
  User.findAll()
    .then(users => {
      if (users && users.length > 0) {
        return res.status(200).json({ users });
      } else {
        return res.status(404).json({ message: 'Usuários nao encontrados' });
      }
    })
    .catch(error => {
      console.log(error)
     return res.status(500).json({ errors: 'Erro no banco de dados' });
    });
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findOne({ where: { id: id } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuário nao encontrado' });
      }
      return res.status(200).json({ user: user });
    })
    .catch(error => {
      res.status(500).json({ errors: 'Erro no servidor' });
    });
};

exports.createUser = (req, res) => {
  const {
    firstname, 
    lastname, 
    email,  
    telphone, 
    password, 
    role,
    repeatPassword
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({ message: 'As senhas não coincidem' });
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      return bcrypt.hash(password, 10);
    })
    .then(hashPassword => {
      
      if(res.headersSent) return;

      return User.create({
        firstname,
        lastname,
        email,
        telphone,
        password: hashPassword,
        role
      });
    })

    .then(() => {
      if(res.headersSent) return;
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    })

    .catch(error => {
      if(res.headersSent) return;
      console.error(error);
      res.status(500).json({ message: 'Houve um erro no servidor' });
    });
};

exports.updateUser = (req, res) => {
  const { firstname, lastname, email, telphone, id } = req.body;

  User.findOne({ where: { id } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ msg: 'Este usuário não existe' });
      }

      return User.update(
        { firstname, lastname, email, telphone },
        { where: { id } }
      )
        .then(() => {
          res.status(200).json({firstname, lastname, email, telphone});
        })
        .catch(error => {
          res.status(500).json({ error: 'Erro ao atualizar usuário no banco de dados', details: error.message });
        });
    })
    .catch(error => {
      return res.status(500).json({ msg: 'Erro interno no banco de dados', details: error.message });
    });
};


exports.deleteUser = (req, res) => {
  const {id} = req.params;
  User.destroy({where: {id: id}}).then(() => {
    res.status(200).json({message: 'Usuário apagado com sucesso'})
  })

  .catch(error => {
    res.status(500).json({errors: 'Erro no servidor'})
  })
}