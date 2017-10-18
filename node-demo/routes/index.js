var express = require('express');
var router = express.Router();
// 加密解密
var crypto = require('crypto');
// 引入model
var User = require('../models/user');
var Post = require('../models/post');
var Commit = require('../models/commit');
// 提示
var flash = require('connect-flash');
// 上传图片的中间件配置
var multer = require('multer')
var storage = multer.diskStorage({
  // 设置保存图片的路径
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/')
  },
  // 上传的图像重命名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
var upload = multer({
  storage: storage
});
// 引入markdown
var markdown = require('markdown').markdown;
// 引入自定义分页
var pageing  = require('../public/javascripts/paging');


module.exports = function (app) {

  // 默认用户头像
  var defaultUserAvator = 'images/defaultUserAvatar.jpg';

  app.get('/', function (req, res) {

    var username;
    var imgpath;
    var page = req.query.p ? parseInt(req.query.p) : 1;

    // 有用户信息吐出name展示
    if (!req.session.user) {
      username = null;
      imgpath = null;
    } else {
      username = req.session.user.username;
      imgpath = req.session.user.useravator;
    }

    Post.getAll(username, page, function(err, posts, total){
      if(err) return posts = [];
      res.render('index', {
        title: '主页',
        user: req.session.user,
        username: username,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 5 + posts.length) == total,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        imgpath: imgpath,
        navActiveNum: 1
      });
    });

    

  });
  /**
   * 注册页
   */
  app.get('/reg', checkNotLogin);
  app.get('/reg', function (req, res) {
    res.render('reg', {
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      navActiveNum: 5
    });
  });
  /**
   * 注册页提交
   */
  app.post('/reg', checkNotLogin);
  app.post('/reg', function (req, res) {

    console.log(req.body);

    if (req.body["password"] != req.body["password-repeat"]) {
      req.flash("error", "两次输入的密码不一致");
      return res.redirect('/reg');
    }
    // 生成密码的md5的值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');

    var newUser = new User({
      username: req.body.username,
      password: password,
      useravator: defaultUserAvator
    });

    User.get(newUser.username, function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        req.flash('error', '用户已存在');
        return res.redirect('/reg');
      }
      newUser.save(function (err, user) {
        if (err) {
          req.flash('err', err);
          return res.redirect('/reg');
        }
        req.session.user = newUser; // 用户信息存入 session
        req.flash('success', '注册成功');
        res.redirect('/');
      });
    });
  });
  /**
   * 登录页
   */
  app.get('/login', checkNotLogin);
  app.get('/login', function (req, res) {
    res.render('login', {
      title: '登录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      navActiveNum: 6
    });
  });
  /**
   * 登录页提交
   */
  app.post('/login', checkNotLogin);
  app.post('/login', function (req, res) {

    var username = req.body.username;
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');

    User.get(username, function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '用户口令错误');
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登入成功');
      res.redirect('/');
    });

  });

  /**
   * 上传头像页面
   */
  app.get('/upload', checkLogin);
  app.get('/upload', function (req, res) {
    res.render('upload', {
      title: '上传头像',
      user: req.session.user,
      username: req.session.user.username,
      imgpath: req.session.user.useravator,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    })
  });

  /**
   * 提交头像
   * 提交的文件对象存放在中间件生成的req.file对象中
   */
  app.post('/upload', upload.single('useravatar'), function (req, res) {
    var imgPath = req.file.path.slice(7);
    // 更新用户头像
    User.update(req.session.user.username, { "useravator": imgPath }, function (err, user) {
      if (err) {
        req.flash('error','保存用户头像出错啦~');
        return res.redirect('/');
      }
      if (!user) {
        req.flash('err', '用户不存在');
        return res.redirect('/');
      }    
    });
    req.session.user.useravator = imgPath;
    req.flash('success', '文件上传成功!');
    res.redirect('/');
  });



  /**
   * 发微博
   * 先验证是否登录 只有登录的用户才会跳转发微博界面
   */
  app.get('/post', checkLogin);
  app.get('/post', function (req, res) {
    res.render('post', {
      title: '发微博',
      user: req.session.user,
      username: req.session.user.username,
      imgpath: req.session.user.useravator,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      navActiveNum: 2
    });
  });
  /**
   * 提交微博
   */
  app.post('/post', checkLogin);
  app.post('/post', function (req, res) {
    var currentUser = req.session.user;
    // req.body.post 获取到用户提交的内容
    var post = new Post(currentUser.username, req.body.title, req.body.post);
    post.save(function (err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '发表成功');
      res.redirect('/u/username=' + encodeURI(currentUser.username));
    })
  });
  /**
   * 用户发表的所有微博详情页
   */
  app.get('/u/username=:username', function (req, res) {
    // 当前的页码
    var page = req.query.p ? parseInt(req.query.p) : 1;
    // 先验证用户是否存在
    User.get(req.params.username, function (err, user) {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/');
      }
      
      // 用户存在的情况 从数据库中获取相应微博内容
      Post.getAll(user.username, page, function (err, posts, total) {

        var pageSize = 2;  // 一页显示数目
        var pageNumber = Math.ceil(total / pageSize)  //总页数
        var pagingControl;

        if(page == null) page = 1;

        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        posts.forEach(function(post){
          post.post = markdown.toHTML(post.post)
        }) 
        // 初始化分页控件
        pagingControl = pageing(total, page, pageSize, user.username);
        
        res.render('user', {
          title: '所有的微博记录',
          user: req.session.user,
          posts: posts,
          page: page,
          pageNumber: pageNumber,
          pagingControl: pagingControl,
          username: user.username,
          imgpath: '../' + user.useravator,
          success: req.flash('success').toString(),
          error: req.flash('error').toString(),
          navActiveNum: 3
        });
      });
    });
  });

  /**
   * 用户发表的具体某一篇微博页面
   */
  app.get('/p/userID=:id', function(req, res){

    var userID = req.params.id;

    Post.getOne(userID, function(err, posts){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      posts.post = markdown.toHTML(posts.post);
      if(posts.comments && posts.comments.length > 0){
        posts.comments.forEach(function(item){
          item.comment = markdown.toHTML(item.comment);
        })
      }
      res.render('article', {
        title: '文章页面',
        user: req.session.user,
        username: req.session.user.username,
        imgpath: '../../../' + req.session.user.useravator,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        navActiveNum: 3
      });
    });

  });

  /**
   * 编辑一篇微博
   */
  app.get('/edit/username=:username/title=:title/time=:time', checkLogin);
  app.get('/edit/username=:username/title=:title/time=:time', function(req, res){

    var username = decodeURI(req.params.username);
    var title    = decodeURI(req.params.title);
    var time     = decodeURI(req.params.time);

    Post.getOne(username, title, time, function(err, posts){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('edit', {
        title: '编辑文章',
        user: req.session.user,
        username: req.session.user.username,
        imgpath: '../../../' + req.session.user.useravator,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        navActiveNum: 3
      });
    });

  });

  /**
   * 更新一篇微博
   */
  app.post('/edit/username=:username/title=:title/time=:time', checkLogin);
  app.post('/edit/username=:username/title=:title/time=:time', function(req, res){

    var username = decodeURI(req.params.username);
    var title    = decodeURI(req.params.title);
    var time     = decodeURI(req.params.time);
    var post     = decodeURI(req.body.post);

    Post.update(username, title, time, post, function(err, posts){

      var originUrl = encodeURI('/u/username=' + username + '/title=' + title + '/time=' + time ); 
      if(err){
        req.flash('error', err);
        return res.redirect(originUrl);
      }
      req.flash('success', '修改成功');
      res.redirect(originUrl);
    });

  });

  /**
   * 删除一篇微博
   */
  app.get('/remove/username=:username/title=:title/time=:time', checkLogin);
  app.get('/remove/username=:username/title=:title/time=:time', function(req, res){

    var username = decodeURI(req.params.username);
    var title    = decodeURI(req.params.title);
    var time     = decodeURI(req.params.time);

    Post.remove(username, title, time, function(err, posts){
      var originUrl = encodeURI("/u/username=" + username);
      if(err){
        req.flash('error', err);
        return res.redirect(originUrl);
      }
      req.flash('success', '删除成功');
      res.redirect(originUrl);
    });

  });


  /**
   * 查找一篇微博
   */
  app.get('/search', function(req, res){

      Post.search(req.query.keyword, function(err, posts){
        if(err){
          req.flash('error', err);
          return res.redirect('/');
        }

        posts.forEach((item)=>{
          item.post = markdown.toHTML(item.post);
        })

        res.render('search', {
          title: req.query.keyword,
          posts: posts,
          user: req.session.user,
          username: req.session.user.username,
          imgpath:  req.session.user.useravator,
          success: req.flash('success').toString(),
          error: req.flash('error').toString(),
          navActiveNum: 3
        })

      })

  })


  /**
   * 微博留言
   */
   app.post('/u/username=:username/title=:title/time=:time', function(req, res){
    // 根据当前用户的名称 time来获取到当前文档对象
    var username = req.params.username;
    var time  = req.params.time;
    var commentContent = (req.body.commentContent == '' || req.body.commentContent == null) ? null : req.body.commentContent ;

    // 留言提交的对象信息
    var comments = {
      username: req.body.username,
      time: new Date().toLocaleString(),
      comment: commentContent
    }

    var newCommit = new Commit(username, time, comments);

    newCommit.save(function(err){

      if(err){
        req.flash('error', err);
        return res.redirect('back');
      }
      req.flash('success', '留言成功');
      res.redirect('back');
    });

  });





  /**
   * 离开页面
   */
  app.get('/logout', checkLogin);
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
  });


  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登入');
      return res.redirect('/');
    }
    next();
  }

  function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登入');
      return res.redirect('/login');
    }
    next();
  }

};
