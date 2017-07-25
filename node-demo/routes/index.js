var express = require('express');
var router = express.Router();
// 加密解密
var crypto = require('crypto');
// 引入封装的数据库操作方法
var User = require('../models/user');
var Post = require('../models/post');
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



module.exports = function (app) {

  app.get('/', function (req, res) {
    var name;
    var imgpath;
    // 有用户信息吐出name展示
    if (!req.session.user) {
      name = null;
      imgpath = null;
    } else {
      name = req.session.user.name;
      imgpath = req.session.user.useravator;
    }
    console.log(req.session.user);
    res.render('index', {
      title: '主页',
      user: req.session.user,
      name: name,
      error: req.flash('error').toString(),
      imgpath: imgpath
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
      error: req.flash('error').toString()
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

    // var md5 = crypto.createHash('md5');
    // var password = md5.update(req.body['password']).digest('base64');

    var newUser = new User({
      name: req.body.username,
      password: req.body.password,
      useravator: 'images/defaultUserAvatar.jpg'
    });

    User.get(newUser.name, function (err, user) {
      if (err) {
        req.flash('error', err);
        res.redirect('/');
      }
      if (user) {
        req.flash('error', '用户已存在');
        res.redirect('/reg');
      }
      newUser.save(function (err, user) {
        if (err) {
          req.flash('err', err);
          res.redirect('/reg');
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
      error: req.flash('error').toString()
    });
  });
  /**
   * 登录页提交
   */
  app.post('/login', checkNotLogin);
  app.post('/login', function (req, res) {

    var name = req.body.username;
    var password = req.body.password;

    User.get(name, function (err, user) {
      if (err) {

      }
      if (!user) {
        req.flash('error', '用户不存在');
        res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '用户口令错误');
        res.redirect('/login');
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
      name: req.session.user.name,
      imgpath: req.session.user.useravator
    })
  });

  /**
   * 提交头像
   * 提交的文件对象存放在中间件生成的req.file对象中
   */
  app.post('/upload', upload.single('useravatar'), function (req, res) {
    var imgPath = req.file.path.slice(7);
    // 更新用户头像
    User.update(req.session.user.name, { "useravator": imgPath }, function (err, user) {
      if (err) {
        req.flash('error','保存用户头像出错啦~');
        res.redirect('/');
      }
      if (!user) {
        req.flash('err', '用户不存在');
        res.redirect('/');
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
      name: req.session.user.name,
      imgpath: req.session.user.useravator
    });
  });
  /**
   * 提交微博
   */
  app.post('/post', checkLogin);
  app.post('/post', function (req, res) {
    var currentUser = req.session.user;
    // req.body.post 获取到用户提交的内容
    var post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function (err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '发表成功');
      res.redirect('/u/username=' + encodeURI(currentUser.name));
    })
  });


  /**
   * 用户微博详情页
   */
  app.get('/u/username=:username', function (req, res) {
    // 先验证用户是否存在
    User.get(req.params.username, function (err, user) {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/');
      }
      // 用户存在的情况 从数据库中获取相应微博内容
      Post.get(user.name, function (err, posts) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        res.render('user', {
          title: '所有的微博记录',
          user: req.session.user,
          posts: posts,
          name: user.name,
          imgpath: '../' + user.useravator,
          error: req.flash('error').toString()
        });
      });
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
