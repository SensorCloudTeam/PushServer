/**
 * Created by lyz on 2015/4/2.
 */
var sqlmanager = require('./sqlmanager.js');
var TABLE = 'sub_view';
var Node = {};
var connection = sqlmanager.connection;
var DATABASE = sqlmanager.DATABASE;

module.exports = Node;

Node.selectAll = function(func){
    connection.query('use '+ DATABASE);
    connection.query('SELECT * FROM '+ TABLE,
        function (err, results) {
        if(err) throw err;
            if (func) {
                func(results);
            }
    });
};

Node.selectByRegID = function(regID,func){
    connection.query('use '+ DATABASE);
    connection.query('SELECT * FROM '+ TABLE +' WHERE regID = ?',[regID],function(err,results){
        if(err) throw err;
        if(func){
            func(results);
        }
    });
};

Node.selectById = function (id, func) {
    connection.query('use '+DATABASE);
    connection.query('SELECT * FROM '+TABLE+' WHERE id=?',[id],
        function (err,results) {
            if(err) throw err;
            if(func){
                func(results);
            }
        });
};

