/**
 * Created by lyz on 2015/4/3.
 */
var sqlmanager = require('./sqlmanager.js');
var TABLE = 'pushstate';
var Node = {};
var connection = sqlmanager.connection;
var DATABASE = sqlmanager.DATABASE;

module.exports = Node;

/*
Node.setPushed = function (id, pushed, func) {
    connection.query('use ' + DATABASE);
    connection.query('UPDATE ' + TABLE + ' SET pushed = ? WHERE id = ?', [pushed, id],
        function (err, results) {
            if (err) throw err;
            if (func) {
                func(results);
            }
        });
};

Node.initPushed = function (func) {
    connection.query('use ' + DATABASE);
    connection.query('UPDATE ' + TABLE + ' SET pushed = false ',
        function (err, results) {
            if (err) throw err;
            if (func) {
                func(results);
            }
        });
};
*/

var sub_view = require('./sub_view');
Node.select = function (func) {
    connection.query('use ' + DATABASE);
    connection.query('SELECT * FROM ' + TABLE, function (err, results) {
        if (err) throw err;
        var newResults = [];
        results.forEach(function (result) {
            sub_view.selectById(result.id, function (rows) {
                if (rows.length == 1) {
                    var row = rows[0];
                    row.pushed = result.pushed;
                    newResults.push(row);
                    func(newResults);
                }
            });
        });
    });
};

Node.insert = function (id, func) {
    connection.query('use ' + DATABASE);
    connection.query('INSERT INTO ' + TABLE + ' SET id = ?', [id], function (err, result) {
        try {
            if (err) throw err;
            if (func) {
                func(result);
            }
        }catch(e){

        }
    });

};

Node.delete = function(id,func){
    connection.query('use '+ DATABASE);
    connection.query('DELETE FROM '+TABLE+' WHERE id = ?',[id],function(err,result){
        if (err) throw err;
        if (func) {
            func(result);
        }
    });
};
