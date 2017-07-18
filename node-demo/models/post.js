var mongodb = require('./db');

function Post(username, post, time)
{
    this.username = username;
    this.post = post;
    if(time)
    {
        this.time = time;
    }else{
        this.tiome = new Date();
    }
}


Post.get = function(username, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
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
            collection.find(query).sort({time: -1}).toArray(function(err, doc){

            });

        });
    });
}
