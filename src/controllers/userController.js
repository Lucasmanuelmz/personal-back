const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getUsers = (req, res) => {
  User.findAll()
    .then(users => {
      if (users.length > 0) {
        return res.status(200).json({ users });
      } else {
        return res.status(404).json({ message: 'Usuários não encontrados' });
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Erro no banco de dados' });
    });
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findOne({ where: { id } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).json({ user });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Erro no servidor' });
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
      return res.status(201).json({ message: 'Usuário criado com sucesso' });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Houve um erro no servidor' });
    });
};

exports.updateUser = (req, res) => {
  const { firstname, lastname, email, telphone, password, id } = req.body;

  User.findOne({ where: { id } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const updateData = { firstname, lastname, email, telphone };
      if (password) {
        return bcrypt.hash(password, 10).then(hashPassword => {
          updateData.password = hashPassword; 
          return User.update(updateData, { where: { id } });
        });
      } else {
        return User.update(updateData, { where: { id } });
      }
    })
    .then(() => {
      return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar o usuário', details: error.message });
    });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.destroy({ where: { id } })
    .then(result => {
      if (result === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).json({ message: 'Usuário apagado com sucesso' });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao apagar usuário', details: error.message });
    });
};
