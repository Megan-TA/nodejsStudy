var util = require('util');

function Base(){
    this.name = 'Base';
    this.showName = function(){
        console.log('this is ' + this.name );
    }
}

Base.prototype.setName = function(replaceName){
    this.replaceName = replaceName;
    console.log('now is ' + this.replaceName);
}


function Sub(){
    /**
     * 根据nodejs docs中的文档，看到若要完整的实现继承，还需要调用父级的call方法。但是还需要借助util工具包的inherits方法。
     */
    this.name = 'Sub';

    Base.call(this);
}
/**
 * inherits默认只继承父级原型链的方法
 * 源码实现如下
 * exports.inherits = function(ctor,superCtor)
{
    ctor.super_=superCtor;
    ctor.prototype = Object.create(superCtor.prototype,{
       constructor :{
           value: ctor,
           enumerable: false,
           writable: true,
           configurable : true
       } 
    });
}
 */
util.inherits(Sub, Base);

var x = new Sub();
console.log(x.name);
x.setName('xxx');

x.showName();


