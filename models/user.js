var bcrypt = require('bcrypt-nodejs');
var uuidV4 = require('uuid/v4');

var pool     = require('./db');
const {response} = require("express");

// Set up User class
var User = function(user) {
  var that = Object.create(User.prototype);

  that.id       = user.id;
  that.email    = user.email;
  that.password = user.password;

  return that;
};

// Gets a random id for this user
var generateUserId = function() {
  return uuidV4();
};

// Hash and salt the password with bcrypt
var hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is correct
var validPassword = function(password, savedPassword) {
  return bcrypt.compareSync(password, savedPassword);
};

// Create a new user
// callback(err, newUser)
var createUser = function(email, password, callback) {
  var newUser = {
    id: generateUserId(),
    email: email,
    password: hashPassword(password)
  };
  //
  pool.query('INSERT INTO users ( id, email, password ) values ($1,$2,$3)',
    [newUser.id, newUser.email, newUser.password],
    function(err) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {//
          // If we somehow generated a duplicate user id, try again
          return createUser(email, password, callback);
        }
        return callback(err,response.status(400));
      }

      // Successfully created user
      return callback(null, new User(newUser), response.status(201));
    }
  );
};

// Check if a user exists and create them if they do not
// callback(err, newUser)
var signup = function(req, email, password, callback) {
  // Check if there's already a user with that email
  pool.query('SELECT * FROM users WHERE email = $1',
      [email],
      function(err, rows) {
    if (err){
     //
      return callback(err,response.status(400));
    }

    if (rows.rowCount>0) {
      return callback(null, false, req.flash('signupMessage', 'An account with that email address already exists.'),response.status(409));
    } else {
      // No user exists, create the user
      return createUser(email, password, callback);
    }
  });
};

// Log in a user
// callback(err, user)
var login = function(req, email, password, callback) {
  // Check that the user logging in exists
  pool.query('SELECT * FROM users WHERE email = $1', [email], function(err, rows) {
    
    if (err)
      return callback(err);

    console.log(rows);

    if (rows.rowCount===0)
      {
        return callback(null, false, req.flash('loginMessage', 'No user found.'),response.status(404));}

    if (!validPassword(password, rows.rows[0].password))
      return callback(null, false, req.flash('loginMessage', 'Wrong password.'),response.status(403));

    // User successfully logged in, return user

    return callback(null, new User(rows.rows[0]), response.status(200));
  });
};

// List all users
// callback(err, users)
var listUsers = function(callback) {
  pool.query('SELECT * FROM users', [], function(err, rows) {
    if (err)
      return callback(err);

    return callback(null, rows);
  });
};


// Delete a user
// callback(err)
var deleteUser = function(id, callback) {
  pool.query('DELETE FROM users WHERE id = $1', [id], callback);
};

exports.signup = signup;
exports.login = login;
exports.listUsers = listUsers;
exports.deleteUser = deleteUser;
