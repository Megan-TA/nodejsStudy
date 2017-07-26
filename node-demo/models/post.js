var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(username, title, post, skipNumber, time)
{
    this.username = username;
    this.title  = title;
    this.post = post;
    this.skipNumber = skipNumber;
    if(time)
    {
        this.time = time;
    }else{
        this.time = new Date().toLocaleString();
    }
}


Post.get = function(username, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        // 找到posts 文档
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            // 分页的限制数量
            var limitNumber = 5;
            var skipNumber  = 0;
            // 查找 user 属性为 username的endangered
            // 如果 username 是null 则匹配全部
            var query = {};
            if(username){
                query.username = username;
            }
            /**
             * time -1 信息从上到下
             * time 1  消息从旧到新展示
             */
            collection.find(query).sort({time: -1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err, null);
                }
                docs.forEach(function(doc){
                    doc.post = markdown.toHTML(doc.post);
                });
                callback(null, docs);
            });

        });
    });
}


Post.prototype.save = function(callback){
    var post = {
        username: this.username,
        title: this.title,
        post: this.post,
        time: this.time
    };
    mongodb.open(function(err, db){
        if(err){
            return callback(err, null);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(post, {
                save: true
            },function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};



module.exports = Post;