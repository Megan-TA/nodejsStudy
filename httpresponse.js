var http = require('http');

var res  = http.get({ host: 'www.baidu.com' });

res.on('response', function(res){
    res.setEncoding('utf8');
    res.on('data', function(data){
        console.log(data);
    });
});