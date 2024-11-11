const { body } = require('express-validator');

const validateUpdateArticle = [
  body('title')
    .trim()
    .isLength({ min: 50, max: 200 })
    .withMessage('O título não pode ter menos de 50 caracteres e deve ter no máximo 200 caracteres.')
    .notEmpty()
    .withMessage('O título é obrigatório. De que trata o seu artigo?'),

  body('description')
    .trim()
    .isLength({ min: 100, max: 200 })
    .withMessage('A descrição deve ter entre 100 e 200 caracteres. Ela é importante para representar o seu artigo nos mecanismos de busca (SEO).')
    .notEmpty()
    .withMessage('A descrição é obrigatória. Crie um resumo breve do seu artigo.'),

  body('article')
    .trim()
    .isLength({ min: 500, max: 3000 })
    .withMessage('O corpo do artigo deve ter entre 500 e 3000 caracteres.')
    .notEmpty()
    .withMessage('O conteúdo do artigo é obrigatório. Escreva um conteúdo relevante sobre o tema do seu artigo.')
];

module.exports = validateUpdateArticle;
