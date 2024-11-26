const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const User = require('../models/userModel'); 
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'xH%9z@Tp+7$3Yp%QtN1z&u6w#bFdH!8WkA4eVZk+LmM1',
}

passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      if (!user) {
        return done(null, false); 
      }
      return done(null, user); 
    } catch (err) {
      console.error(err);
      return done(err, false);
    }
  })
);

module.exports = passport;
