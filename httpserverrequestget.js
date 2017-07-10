var http = require('http');
var url  = require('url');
var util = require('util');

http.createServer(function(req, res){

    res.writeHead(200,{'Content-Type': 'text/html'});
    
    // 对象中的query相当于get请求的内容
    res.end(util.inspect(url.parse(req.url), true));

}).listen(3001);