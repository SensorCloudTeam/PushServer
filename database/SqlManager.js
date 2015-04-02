var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456'
});

var DATABASE = 'wsn';

var sqlmanager = {connection:connection,DATABASE:DATABASE};
module.exports = sqlmanager;
