var util = require('util');

function Person(){
    this.name = 'Person';
    this.showName = function(){
        console.log('you is ' + this.name);
    }
};

var obj = new Person();

/**
 * 将一个对象转换成字符串
 */
console.log(util.inspect(obj));
console.log(util.inspect(obj, true));