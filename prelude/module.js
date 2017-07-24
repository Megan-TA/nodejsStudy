function Hello(){
    var name;

    this.setName = function(thyName){
        name = thyName;
    };

    this.sayHello = function(){
        console.log('Hello ' + name);
    };
   
};

/**
 * 比较下面两种输出方式有何不同
 * exports本身是一个空对象 可以被重写  本质上是通过它为模块闭包的内部建立一个有限的访问接口
 * 也不能通过对exports直接赋值代替对module.exports赋值
 * 两者实际上都指向同一个对象的变量
 * exports在执行完就释放 module不会
 */

//exports.Hello = Hello;

module.exports = Hello;