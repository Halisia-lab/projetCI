var mysql    = require('mysql');

var dbconfig = require('../config/database');
var pool     = require('./db');

// Script for setting up database and tables
//var conn = mysql.createConnection(dbconfig.connection);

//conn.query('CREATE DATABASE ' + dbconfig.database);

// Set up users table
pool.query('\
  CREATE TABLE users ( \
    id CHAR(36) NOT NULL PRIMARY KEY, \
    email VARCHAR(255) NOT NULL, \
    password CHAR(60) NOT NULL, \
    admin BOOLEAN NOT NULL DEFAULT 0 \
  )');//

console.log('Success! Database created.');
//conn.end();
