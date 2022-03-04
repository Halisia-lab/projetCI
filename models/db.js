var mysql = require('mysql');
var dbconfig = require('../config/database');


const { Pool } = require('pg')
const pool = new Pool({
  host: 'ec2-99-80-108-106.eu-west-1.compute.amazonaws.com',
  user: 'imzizxlnokowum',
  password: '19625a9067ae393372f89e3c4ca3c183c039763c92c7dac31cb120dc777ca581',
  database: 'ddibnn3c33klk6',
  ssl:true,
  port:5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

var query = function(queryString, params, callback) {
pool.connect((err, client, release) => {//
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query(queryString, params, function(err, rows) {
    client.release();

    if (err)
      return callback(err);

    return callback(err, rows);
  });
})
}



pool.query('\
  CREATE TABLE IF NOT EXISTS users  ( \
    id CHAR(36) NOT NULL PRIMARY KEY, \
    email VARCHAR(255) NOT NULL UNIQUE, \
    password CHAR(60) NOT NULL, \
    admin BOOLEAN NOT NULL DEFAULT false \
  )');//

// console.log('Success! Database created.');
// Database setup
//var pool = mysql.createPool(dbconfig.connection);
// pool.getConnection(function(err, conn) {
//   conn.query('USE ' + dbconfig.database, function() {
//     conn.release();
//   });
// });

// // Returns a connection to the db
// var getConnection = function(callback) {
//   pool.getConnection(function(err, conn) {
//     callback(err, conn);
//   });
// };

// Helper function for querying the db; releases the db connection
// callback(err, rows)
// var query = function(queryString, params, callback) {
//   getConnection(function(err, conn) {
//     if (err)
//       return callback(err);
//     conn.query(queryString, params, function(err, rows) {
//       conn.release();

//       if (err)
//         return callback(err);

//       return callback(err, rows);
//     });
//   });
// };

// Heartbeat function to keep the connection to the database up
var keepAlive = function() {
  pool.query((err, conn) => {
    if (err)
      return;

    conn.ping();
    conn.release();
  });
};

 //Set up a keepalive heartbeat
 setInterval(keepAlive, 30000);

exports.query = query;
