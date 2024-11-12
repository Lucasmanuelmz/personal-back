const User = require('../models/userModel');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getUsers = (req, res) => {
  User.findAll()
    .then(users => {
      if (users && users.length > 0) {
        return res.status(200).json({ users });
      } else {
        return res.status(404).json({ message: 'Usuarios nao encontrados' });
      }
    })
    .catch(error => {
      console.log(error)
     return res.status(500).json({ errors: 'Erro no banco de dados' });
    });
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findOne({ where: { id } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuario nao encontrado' });
      }
      return res.status(200).json({ user });
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
    repeatPassword
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({ message: 'As senhas não coincidem' });
  }

  bcrypt.hash(password, 10, async (error, hashPassword) => {

  if(error) {
    return res.status().json({message: 'Erro ao obter o password'})
  }

  try {
  await User.create({
    firstname,
    lastname,
    email,
    telphone,
    password: hashPassword,
    role
  })

  res.status(201).json({message: 'Usuário criado com sucesso'})

}catch {
   return res.status(500).json({message: 'Houve um erro no servidor'})
  }
})
}

exports.updateUser =(req, res) => {
  const {firstname, lastname, email, telphone, id} = req.body;

  User.update(
    {
      firstname,
      lastname,
      email,
      telphone
    },{
      where: {id: id}
    })

    .then(() => {
      res.status(201).json({msg: 'Usuario atualizado com sucesso!'})
    })

    .catch(error => {
      res.status(500).json({error: 'Erro ao atualizar usuario no banco de dados'})
    })
}

exports.deleteUser = (req, res) => {
  const {id} = req.params;
  User.destroy({where: {id: id}}).then(() => {
    res.status(200).json({message: 'Usuario apagado com sucesso'})
  })

  .catch(error => {
    res.status(500).json({errors: 'Erro no servidor'})
  })
}