var configure = require('./configure.js');
var JPush = require('jpush-sdk');
var client = JPush.buildClient(configure.app.appKey,configure.app.masterSecret);

var msgList = [];
var pushToRegistration = function(id,message){
	client.push.setPlatform('Android')
		.setAudience(JPush.registration_id(id))
		.setMessage(message)
		.setOptions(null,60)
		.send(function(err,res){
			if(err){
				console.log(err.message);
			}else{
				console.log('Sendno: ' + res.sendno);
            	console.log('Msg_id: ' + res.msg_id);
            	msgList.push(res.msg_id);
			}
		})
};
client.getReportReceiveds(msgList.toString(), function(err, res) {
    if (err) {
        console.log(err.message);
    } else {
        for (var i=0; i<res.length; i++) {
            console.log(res[i].android_received);
            console.log(res[i].ios_apns_sent);
            console.log(res[i].msg_id);
            console.log('------------');
        }
    }
});