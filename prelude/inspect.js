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
 * util.inspect(object, [showHidden], [depth], [colors])
 * 输入要转成字符串的对象
 * 展示更多隐藏信息;
 * 表示最大的递归的层数
 * 彩色输出
 */
console.log(util.inspect(obj));
console.log(util.inspect(obj, true));