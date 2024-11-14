const { body } = require('express-validator');

const userAuthValidate = [
  body('firstname').trim()
    .isAlpha().withMessage('O nome deve conter apenas caracteres alfabéticos')
    .isLength({ min: 3, max: 100 }).withMessage('O nome deve ter entre 3 e 100 caracteres.'),

  body('lastname').trim()
    .isAlpha().withMessage('O sobrenome deve conter apenas caracteres alfabéticos')
    .isLength({ min: 3, max: 100 }).withMessage('O sobrenome deve ter entre 3 e 100 caracteres.'),

  body('email').trim()
    .isEmail().withMessage('O email deve ser válido e conter um "@"')
    .isLength({ min: 10, max: 200 }).withMessage('O email deve ter entre 10 e 500 caracteres.'),

  body('telphone').trim()
    .isNumeric().withMessage('O número de telefone deve conter apenas números')
    .isLength({ min: 9, max: 15 }).withMessage('O telefone deve ter entre 10 e 15 números'),

  body('password').trim()
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@#.*^]{10,}$/).withMessage('A senha deve conter caracteres alfanuméricos e ter ao menos 10 caracteres')
    .isLength({ min: 10, max: 100 }).withMessage('A senha deve ter entre 10 e 100 caracteres.'),

  body('repeatPassword').trim()
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@#.*^]{10,}$/).withMessage('A senha deve conter caracteres alfanuméricos e ter ao menos 10 caracteres')
    .isLength({ min: 10, max: 100 }).withMessage('A senha deve ter entre 10 e 100 caracteres.')
];

module.exports = userAuthValidate;
