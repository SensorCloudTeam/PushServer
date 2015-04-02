var configure = require('./configure.js');
// var JPush = require('jpush-sdk');
// var client = JPush.buildClient(configure.app.appKey,configure.app.masterSecret);

var table_jpush = require('./database/pushreg.js');
var table_user = require('./database/user.js');

var url = require('url');
var http = require('http');
var querystring = require('querystring');
var STATUSCODE = {OK:200,Not_Found:404};

/*处理Http的get post请求*/
var server = http.createServer(function(request,response){
	//设置接受数据编码格式为UTF-8
	request.setEncoding('utf-8');
	console.log(request.method);
	var params = "{}";
	if(request.method == "GET"){
		params = url.parse(request.url,true).query; //url的get请求的参数部分,返回json格式数据
		console.log(params);
		updateData(params,response);
	}
	else{
		//存放post数据
		var postData = ""; 
		request.addListener("data",function(postDataChunk){
			postData+=postDataChunk;
		});
		request.addListener("end",function(){
			console.log("数据完成接受！");
			params = querystring.parse(postData);
			console.log(params);
			updateData(params,response);
		});
	}
}).listen(configure.ip.port,configure.ip.host);

console.log('--------------Server Start----------------');
console.log('Server listening on '+ configure.ip.host +':'+configure.ip.port);

var writeResponse = function(response,statuscode,body){
	response.writeHead(statuscode,{
		'Content-Length':body.length,
		'Content-Type':'text/plain'
	});
	response.write(body);
	response.end();
};

var  updateData = function(params,response){
		var pushreg = {};
		pushreg.user_id = params.id;
		pushreg.regID = params.regID;

		table_user.check(
			{id:params.id,password:params.password},
			table_jpush.updateOrInsert.bind(this,pushreg,
				function(flag){
					if(flag){
						writeResponse(response,STATUSCODE.OK,"Success!");
					}
					else{
						writeResponse(response,STATUSCODE.OK,"Failed!");
					}
				})
		);

	
};


