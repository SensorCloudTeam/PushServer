var sqlmanager = require('./sqlmanager.js');
var TABLE = 'subscription';
var Node = {};
var connection = sqlmanager.connection;
var DATABASE = sqlmanager.DATABASE;
module.exports = Node;

Node.listAll = function(func){

    connection.query('use '+DATABASE);
    var query = connection.query('SELECT * from '+TABLE+' ', function (err,results) {
        if(err) throw err;
        if(func)
            func(results);
    });
};
