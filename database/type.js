/**
 * Created by lyz on 2015/4/23.
 */
var sqlmanager = require('./sqlmanager.js');
var TABLE = 'type';
var Node = {};
var connection = sqlmanager.connection;
var DATABASE = sqlmanager.DATABASE;
module.exports = Node;

Node.getNameById = function(id,fuc){
    connection.query('use '+DATABASE);
    var query = connection.query('SELECT name from '+TABLE+' WHERE id=?',[id], function (err,results) {
        if(err) throw err;
        if(func)
            func(results);
    });
}