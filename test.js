var later = require('later');
var sched = later.parse.recur().every(10).second().after('12:00').time().before('22:00').time();
//var occurrences = later.schedule(sched).next(10);
var sendMessage = function(){
    console.log(new Date());
};

var timer = later.setInterval(sendMessage.bind(this),sched);



