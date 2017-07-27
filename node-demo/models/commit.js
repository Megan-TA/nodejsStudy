/**
* 留言模型
* @authors chen_huang (chen_huang@ctrip.com)
* @date 17-07-27
* @version 1.0
*/

var mongodb = require('./db');


function Comment(username, time, comments){
    this.username = username;
    this.time     = time;
    this.comments  = comments;
}

module.exports = Comment;

/**
 * 存储一条留言
 */
Comment.prototype.save = function(callback){
    
    var username = this.username;
    var time = this.time;
    var comment = this.comments;   

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                return callback(err)
            }
            /**
             * 根据username title time 查询到文档对象 并将 一条留言对象
             * 插入到comments数组里面
             */
            collection.update({
                username: username,
                time: time
            }, {
                $push: {
                    comments: comment
                }
            }, function(err){
                mongodb.close();
                if(err) return callback(err);
                callback(null);
            })
        })
    })
}