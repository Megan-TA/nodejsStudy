# nodejsStudy
![node](https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1841004364,244945169&fm=58&bpow=121&bpoh=75)   ![mongodb](https://perlmaven.com/img/mongodb-logo.png)
## 基于nodejs学习做的一个简单的微博系统   

> #### 技术栈
> ##### node + express + mongodb

## **开始步骤**

1. 切换到node-demo目录下 运行相关运行指令

>     supervisor --debug ./bin/www

2. mongodb数据存放在D:\mongodb\data  

2. CMD进入到D:\mongodb\bin目录下运行mongodb指令

>     mongod --dbpath d:\mongodb\data

3. D:\mongodb\data\db  来启动mongo服务器127.0.1.0.1:27017

4. nodejs debug模式调试借用中间件 node-inspector  npm中运行下面代码 

>     node-inspector 

5. 浏览器输入127.0.0.1:8080?port=5858 进入nodejs调试界面

5. mongodb图形化工具Robomongo

---
>
>
实现相关功能如下：
* 注册
* 登录
* 上传头像
* 发表微博
* 查看微博
* 编辑微博
* 删除微博
* 留言
* 分页
>
>
---

> ### 相关开发工具链接

* [Express 链接](http://www.expressjs.com.cn/)
* [mongodb 链接](https://www.mongodb.com/)
* [Robomongo 链接](https://robomongo.org/download)
* [node-inspector 链接](https://github.com/node-inspector/node-inspector)

>     return shell_exec("echo $input | $markdown_script");

***