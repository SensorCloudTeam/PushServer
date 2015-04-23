var pushServer = {};
module.exports = pushServer;
var configure = require('./configure.js');
var JPush = require('jpush-sdk');
var client = JPush.buildClient(configure.app.appKey, configure.app.masterSecret, 3);
var msgList = [];

var pushstate = require('./database/pushstate.js');

var pushToRegistration = function (pushLine) { //pushLine为表sub_view的记录
    /*在数据库的推送记录中删除*/
    pushstate.delete(pushLine.id);

    console.log(new Date());
    var pushContent = pushLine.sensor_name + ": " + pushLine.sensor_value + "  at " + pushLine.data_time;
    client.push().setPlatform('android')
        .setAudience(JPush.registration_id(pushLine.regID))
        .setNotification('SensorCloud', JPush.android(pushContent, null, 1))
        .setOptions(null, 60)
        .send(function (err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
                msgList.push(res.msg_id);

                /*处理推送的结果报告*/
                client.getReportReceiveds(msgList.toString(), function (err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        for (var i = 0; i < res.length; i++) {
                            console.log(res[i].android_received);
                            console.log(res[i].ios_apns_sent);
                            console.log(res[i].msg_id);
                            console.log('------------');
                        }
                    }
                });
            }
        })
};


var later = require('later');
later.date.localTime(); // 设置本地时区
var sub_view = require('./database/sub_view.js');


function joinPush(result) { //sub_view表的一行字段
    var schedule = later.parse.recur().
        every(result.send_frequency).minute().
        after('7:00').time().
        before('22:00').time();
    var t = later.setInterval(pushToRegistration.bind(this, result), schedule);
    /*立即推送*/
    var sche_now = later.parse.recur().every(0).second();
    var t_now = later.setTimeout(pushToRegistration.bind(this, result), sche_now);

};

pushServer.checkMessage = function () {
    pushstate.select(function(results){
        results.forEach(function(result){
            joinPush(result);
        });
    });
}

pushServer.start = function () {
    sub_view.selectAll(function (results) {
        results.forEach(function (result) {
            pushstate.insert(result.id, null);
        });
    });
    /*每隔10秒检查数据库是否有更新*/
    var schedule = later.parse.recur().every(10).second();
    later.setInterval(pushServer.checkMessage.bind(this), schedule);
};

pushServer.init = function () {
    msgList = [];
    pushServer.start();
};