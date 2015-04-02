var sqlmanager = require('./sqlmanager.js');
var TABLE = 'pushreg';
var Node = {};
var connection = sqlmanager.connection;
var DATABASE = sqlmanager.DATABASE;

module.exports = Node;
Node.insert = function(user,func){

	connection.query('use '+DATABASE);
	var query = connection.query('INSERT INTO '+TABLE+' '+'SET user_id=?,regID=?;',
		[user.user_id, user.regID],
		function(err,result){
			if(err) throw err;
			if(func){
				func(result.insertId);
			}
		});
};

Node.update = function(user,func){

	connection.query('use '+DATABASE);
	connection.query('UPDATE '+TABLE+' '+'SET regID = ? WHERE user_id = ?',
		[user.regID, user.user_id],
		function(err,result){
			if(err) throw err;
			if(func){
				func(result.changedRows);
			}
		});
};
Node.delete = function(user_id,func){
	this.errTip = '[pushreg] delete error';
	this.func = func;

	connection.query('use '+DATABASE);
	connection.query('DELETE FROM '+TABLE+' '+'WHERE user_id=?',
		[user_id],
		function(err,result){
			if(err) throw err;
			if(func){
				func(result.affectedRows);
			}
		});
};

Node.updateOrInsert = function(user,func){
	
	connection.query('use '+DATABASE);
	connection.query('SELECT * FROM '+TABLE+' WHERE user_id=?',[user.user_id],
		function(err, results){
			if(err) throw err;
			if(results.length>0){
				Node.update(user,func);
			}
			else{
				Node.insert(user,func);
			}
		}
	);
};
