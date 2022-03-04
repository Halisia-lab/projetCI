var LocalStrategy = require('passport-local').Strategy;

var pool = require('../models/db');
var user = require('../models/user');

module.exports = function(passport) {

  // Passport session setup, required for persistent login sessions
  // Used to serialize and unserialize users out of session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    pool.query('SELECT * FROM users WHERE id = $1', [id], function(err, rows) {
      
      done(err,rows.rows[0]);
    });
  });

  




  // Local signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // Pass the entire request back to the callback
  }, user.signup));

  // Local login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // Pass the entire request back to the callback
  }, user.login));

};
