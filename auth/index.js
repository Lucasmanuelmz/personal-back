const express = require('express');
const auth = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); 
const User = require('../models/userModel');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'devlucas.icu',
  audience: 'devlucas.icu'
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  User.findOne({ id: jwt_payload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
}));

auth.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const payload = { sub: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '4h',
      issuer: options.issuer,
      audience: options.audience
    });

    res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    next(error);
  }
});

module.exports = auth;
