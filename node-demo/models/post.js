/**
* 微博模型
* @authors chen_huang (chen_huang@ctrip.com)
* @date 17-07-27
* @version 1.0
*/

var mongodb = require('./db');

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

/**
 * 获取用户发表的所有文章
 * 一次获取十篇文章
 */
Post.getAll = function(username, page, callback){
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
            /**
             * time -1 信息从新到旧
             * time 1  消息从旧到新展示
             * 
             * 使用 count 返回特定查询的文档数 total
             */
            collection.count(query, function(err, total){
                collection.find(query, {
                    skip: (page - 1) * 2,
                    limit: 2
                }).sort({
                    time: -1
                }).toArray(function(err, docs){
                    mongodb.close();
                    if(err) return callback(err);
                    callback(null, docs, total);
                })
            })

            // collection.find(query).sort({time: -1}).toArray(function(err, docs){
            //     mongodb.close();
            //     if(err){
            //         return callback(err, null);
            //     }
            //     callback(null, docs);
            // });

        });
    });
};

/**
 * 获取一篇文章
 */
Post.getOne = function(username, title, time, callback){

    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                "title": title,
                "username": username,
                "time": time
            }, function(err, doc){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                callback(null, doc);
            });
        })
    });


};

/**
 * 编辑一篇文章 
 */
Post.edit = function(username, title, time, callback){

    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                "title": title,
                "username": username,
                "time": time
            }, function(err, doc){
                if(err){
                    mongodb.close();
                    return callback(err);
                }

                callback(null, doc);
            });
        })
    });


};

/**
 * 更新一篇文章 
 */
Post.update = function(username, title, time, post, callback){

    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.updateOne({
                "title": title,
                "username": username,
                "time": time
            }, {
                $set: { post: post}
            }, function(err, doc){
                if(err){
                    mongodb.close();
                    return callback(err);
                }

                callback(null, doc);
            });
        })
    });


};

/**
 * 删除一篇文章
 */
Post.remove = function(username, title, time, callback){

    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                "title": title,
                "username": username,
                "time": time
            },  1,  function(err, doc){
                if(err){
                    mongodb.close();
                    return callback(err);
                }

                callback(null, doc);
            });
        })
    });


};

/**
 * 查找一篇文章
 */
Post.search = function(keyword, callback){

    mongodb.open(function(err, db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var keywordParam = new RegExp(keyword, "i");
            collection.find({
                "title": keywordParam
            }).sort({
                time: -1
            }).toArray(function(err, docs){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                callback(null, docs);
            });
        })
    });


};

Post.prototype.save = function(callback){
    var post = {
        username: this.username,
        title: this.title,
        post: this.post,
        time: this.time,
        comments: []
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