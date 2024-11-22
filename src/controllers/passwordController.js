const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); 

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiration = Date.now() + 3600000; 

      user.resetToken = resetToken;
      user.resetTokenExpiration = resetTokenExpiration;
      return user.save();
    })
    .then(user => {
    
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASSWORD, 
        },
      });

      const resetLink = `https://api.devlucas.icu/reset-password/${user.resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Recuperação de Senha',
        text: `Clique no link para redefinir sua senha: ${resetLink}`,
      };

      return transporter.sendMail(mailOptions);
    })
    .then(() => {
      res.status(200).send({ message: 'Codigo para resetar senha enviado' });
    })
    .catch(err => {
      res.status(500).send({ error: 'Erro ao enviar e-mail' });
    });
};


exports.resetPassword = (req, res) => {
  const { token } = req.params;

  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: { [Op.gt]: Date.now() }
    }
  })
    .then(user => {
      if (!user) {
        return res.status(400).send({ error: 'Invalido, token expirado' });
      }

      res.status(200).send({ message: 'Por favor digita nova senha' });
    })
    .catch(err => {
      res.status(500).send({ error: 'Alguma coisa nao esta bem' });
    });
};

exports.resetPasswordToken = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body; 

  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: { [Op.gt]: Date.now() }
    }
  })
    .then(user => {
      if (!user) {
        return res.status(400).send({ error: 'Token invalido ou expirado' });
      }

      return bcrypt.hash(newPassword, 10)
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.resetToken = null; 
          user.resetTokenExpiration = null; 
          return user.save();
        })
        .then(() => {
          res.status(200).send({ message: 'Senha atualizado com sucesso' });
        });
    })
    .catch(err => {
      res.status(500).send({ error: 'Alguma coisa nao esta bem' });
    });
};
