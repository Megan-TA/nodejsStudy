/**
* 用户模型
* @authors chen_huang (chen_huang@ctrip.com)
* @date 17-07-27
* @version 1.0
*/

var mongodb = require('./db');
var crypto  = require('crypto');


function User(user){
    this.username = user.username;
    this.password = user.password;
    this.useravator = user.useravator;   
}

// 通过username读取信息
User.get = function(username, callback){
    // 先打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        // 读取 users 集合
        db.collection('users', function(err, collection){
            if(err){
                db.close();
                return callback(err);
            }
            collection.findOne({
                username: username
            }, function(err, user){
                mongodb.close();
                if(err){
                   return callback(err); //失败 返回err信息
                }
                callback(null, user); // 成功~ 返回查询的用户信息
            });
        });

    });
};

// 保存用户信息
User.prototype.save = function(callback){
    // 存入mongodb的文档
    var user = {
        username: this.username,
        password: this.password,
        useravator: this.useravator
    };
    // var md5 = crypto.createHash('md5'),
    //     name = md5.update(user.name).digest('base64'),
    //     password = md5.update(user.password).digest('base64');
   
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('users', function (err, collection) {

            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(user, {
                safe: true
            }, function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                console.log(result.ops[0]);
                callback(null);  // 成功！err为null,并返回存储后的用户文档
            });

        });
   

    });

       
};

// 更新用户信息
User.update = function(username, updateInfo, callback){
    mongodb.open(function(err, db){
        if(err) return callback(err);

        db.collection('users', { safe: true }, function(err, collection){
            collection.update({"username" : username}, {$set: updateInfo}, function(err, result){
                mongodb.close();
                if(err) return callback(err);
                callback(null);
            });
        })
    });
}


module.exports = User;