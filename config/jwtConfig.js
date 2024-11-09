const jwt = require('jsonwebtoken');
const jwtConfig = require('../objects/jwt');
const secret = process.env.STRATEG;

const user = {
  email:'alfacetj1@gmail.com',
  username: 'lucasmz'
}

jwt.sign({data: user}, secret, jwtConfig);