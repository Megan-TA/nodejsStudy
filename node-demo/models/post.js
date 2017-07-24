var mongodb = require('./db');

function Post(username, title, post, time)
{
    this.username = username;
    this.title  = title;
    this.post = post;
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
            // 查找 user 属性为 username的endangered
            // 如果 username 是null 则匹配全部
            var query = {};
            if(username){
                query.username = username;
            }
            collection.find(query).sort({time: -1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err, null);
                }
                var posts =[];
                docs.forEach(function(doc, index){
                    var post = new Post(doc.username, doc.title, doc.post, doc.time);
                    posts.push(post);
                });
                callback(null, posts);
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
            // 为user属性添加索引
            collection.ensureIndex('user');
            collection.insert(post, {
                save: true
            },function(err, post){
                mongodb.close();
                if(err){
                    return callback(err, null);
                }
                callback(err, post);
            });
        });
    });
};



module.exports = Post;