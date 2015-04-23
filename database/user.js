var sqlmanager = require('./sqlmanager.js');
var TABLE = 'user';
var Node = {};
var connection = sqlmanager.connection;
var DATABASE = sqlmanager.DATABASE;

module.exports = Node;

Node.check = function(user,func){
	connection.query('use '+DATABASE);
	
	connection.query('SELECT * FROM '+TABLE+' WHERE id= ? and password = ?',[user.id,user.password],
		function(err, results){
			if(err) throw err;
			func();

		}
	);
	
};