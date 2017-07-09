var http = require('http');
var fs   = require('fs');



console.log('----------------------000000000-------------------------------');

/**
 * 同步读取文件内容
 * 先返回end1. 再返回读取的内容
 * @param  {[type]} err                                                                      [description]
 * @param  {[type]} data){	if(err){		console.error(err);	}else{		console.log(data);	}} [description]
 * @return {[type]}                                                                          [description]
 */
fs.readFile('test.txt', 'utf-8', function(err, data){
	if(err){
		console.error(err);
	}else{
		console.log(data);
	}
});

console.log('end1.');


console.log('----------------------1111111111-------------------------------');

/**
 * 异步读取文本内容
 * 一般情况下先输出文本容 在输出end2.
 */

var dataSync = fs.readFileSync('test2.txt', 'utf-8');



console.log(dataSync);

console.log('end2.');

console.log('----------------------2222222222-------------------------------');




http.createServer(function (reg, res) {
	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.write('<h1>Hi NodeJS</h1>');
	res.end('<p>Hello World</p>');
}).listen(3000);




console.log('url地址栏输入127.0.0.1:3000即可访问');