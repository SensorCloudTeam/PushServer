/**
 * Created by lyz on 2015/4/23.
 */
    
var subscriptionTable = require('./database/subscription.js');
var nodeMailer = require('nodemailer');
var typeTable = require('./database/type.js');
var sensorTable = require('./database/sensor.js');

var transporter = nodeMailer.createTransport({
    service:'163',
    port:465,
    auth: {
        user: 'ECNU_Sei_Lab301@163.com',
        pass: 'seilab301'
    }
});

//var transporter = nodeMailer.createTransport();

var mailOptions = {
    from: 'ECNU_Sei_Lab301@163.com ', // sender address
    to: '1172993815@qq.com', // list of receivers
    subject: 'Hello ?', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<b>Hello world ?</b>' // html body
};


var send = function(row){
    var html = "SensorCloud 订阅数据\n";
    //html+= row.name+"  ";

    sensorTable.getTypeById(row.sensor_id,function(result){
        console.log('name:'+result.name);
        html+=result.name+":";
        sensorTable.getValueById(row.sensor_id,function(rows){
            //console.log(rows.length);
            console.log('value:'+rows[0].value);
            html+=rows[0].value;
            html+="\n\nFrom SensorCloud传感云平台:\n"+
            "上海中山北路3663号 华东师范大学";
            setOptions(row.address,'SenorCloud',html);
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });
        });

    });
};



function setOptions(toEmail,subject,text,html){
    console.log(toEmail);

    mailOptions = {
        from: 'ECNU_Sei_Lab301@163.com ', // sender address
        to: toEmail, // list of receivers
        subject:subject, // Subject line
        text: text, // plaintext body
        html: html // html body
    };
}
var later = require('later');
later.date.localTime(); // ���ñ���ʱ��
var Map = require('./libs.js');
var subMap = new Map();
function init(){
    var schedule = later.parse.recur().
        every(1).minute();
    var t = later.setInterval(execute.bind(this), schedule);
}

function execute(){
    subscriptionTable.listAll(function(results){
        console.log(results.length);
        if(results){

            results.forEach(function(row){
                console.log(row);
                if(subMap.get(row.id)){

                }
                else{
                    subMap.put(row.id,row);

                    var minutes = 1;
                    switch (row.send_frequency){
                        case 1:minutes = 1;break;
                        case 2:minutes = 60 ;break;
                        case 3:minutes = 60*6 ;break;
                        case 4:minutes = 60*24 ;break;
                        default :
                            minutes = 1;
                    }
                    var schedule = later.parse.recur().
                        every(minutes).minute();
                    var t = later.setInterval(send.bind(this,row), schedule);
                    /*��������*/
                    var sche_now = later.parse.recur().every(0).second();
                    var t_now = later.setTimeout(send.bind(this,row), sche_now);
                }


            });
        }
    });
}

init();