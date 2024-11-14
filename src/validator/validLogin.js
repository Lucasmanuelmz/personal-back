const { body } = require('express-validator');

const validLogin = [
  body('email').trim()
  .isEmail().withMessage('O email deve ser real e ter um @')
  .isLength({min: 10, max: 500}).withMessage('O email deve ter de 10 a 500 caracteres.'),

  body('password').trim()
  .matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@#.*^]{10,}$/).withMessage('A senha deve conter caracteres alfanuméricos e ter ao menos 10 caracteres')
  .isLength({min: 10, max: 100}).withMessage('A senha deve ter de 10 a 100 caracteres.'),
];

module.exports = validLogin;