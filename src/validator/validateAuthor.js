const { body } = require('express-validator');

const validateAuthor = [
  body('firstname')
    .trim()
    .isAlpha('pt-BR', { ignore: ' ' }).withMessage('O nome deve conter apenas caracteres alfabéticos.')
    .isLength({ min: 3, max: 100 }).withMessage('O nome deve ter entre 3 e 100 caracteres.'),

  body('lastname')
    .trim()
    .isAlpha('pt-BR', { ignore: ' ' }).withMessage('O sobrenome deve conter apenas caracteres alfabéticos.')
    .isLength({ min: 3, max: 100 }).withMessage('O sobrenome deve ter entre 3 e 100 caracteres.'),

  body('bio')
    .trim()
    .isLength({ min: 300, max: 1000 }).withMessage('A bio deve ter entre 300 e 1000 caracteres.')
    .withMessage('A bio é um pequeno resumo sobre você para demonstrar sua autoridade na área.'),
];

module.exports = validateAuthor;
