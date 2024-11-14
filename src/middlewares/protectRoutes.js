const passport = require('passport');

const protectRouter =  passport.authenticate('jwt', { session: false });

module.exports = protectRouter;