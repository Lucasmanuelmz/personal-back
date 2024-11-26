const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const auth = express.Router();
require('dotenv').config();

auth.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'xH%9z@Tp+7$3Yp%QtN1z&u6w#bFdH!8WkA4eVZk+LmM1', 
      { expiresIn: '4d' });

    return res.json({ message: 'Autenticado com sucesso', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = auth;
