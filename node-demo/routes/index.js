var express = require('express');
var router = express.Router();
// 加密解密
var crypto = require('crypto');
// 引入封装的数据库操作方法
var User = require('../models/user');
var flash = require('connect-flash');


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// /* -----------------------------test start------------------------------------ */
// /**
//  * test page
//  */
// router.get('/test', function(req, res, next) {
//   res.render('test',  { title: 'I am from test Page!' });
//   next();
// });
// /**
//  * test page的子页面
//  */
// router.get('/test/:test', function(req, res, next) {
//   res.render('test',  { title: 'My parent is test page~~' });
// });
// /**
//  * 默认router不会匹配同一个规则,只会先取匹配到的第一个规则
//  * 若想调用多个同一规则 需要调用next()来进行控制权转移
//  */
// router.get('/test', function(req, res, next) {
//   console.log('--------------');
//   console.log(req.param);
//   console.log('--------------');
// });
// /**
//  * 测试 验证二级路径名称验证
//  */
// var users = {
//   'search': {
//     name: 'Carbo',
//     webSite: 'http://www.baidu.com'
//   }
// };

// router.all('/user/:username', function(req, res, next){
//   //  检查用户是否存在
//   if(users[req.params.username])
//   {
//     next();
//   }else{
//     console.log(users);
//     next(new Error( req.params.username + ' does not exist.' ));
//   }

// });

// router.get('/user/:username', function(req, res){
//   // 用户一定存在 直接展示
//   res.send(JSON.stringify(users[req.params.username]));
// });
// /* -----------------------------test end------------------------------------ */

// /**
//  * 
//  */
// router.get('/u/:user', function(req, res){
 
// });
// /**
//  * 登录
//  */
// router.get('/login', function(req, res){

// });
// /**
//  * 登录提交
//  */
// router.post('/login', function(req, res){

// });
// /**
//  * 登出
//  */
// router.get('/logout', function(req, res){

// });
// /**
//  * 登出提交
//  */
// router.post('/logout', function(req, res){

// });


module.exports = function(app){

    app.get('/', function(req, res){
      var name;
      // 有用户信息吐出name展示
      if(!req.session.user){
        name = null;
      }else{
        name = req.session.user.name;
      }
      console.log(req.session.user);
      res.render('index',  { 
        title: '主页',
        user: req.session.user,
        name: name
      });

    });
    /**
     * 注册页
     */
    app.get('/reg', checkNotLogin);
    app.get('/reg', function(req, res){
      res.render('reg',  {
         title: '注册',
         user: req.session.user
      });
    });
    /**
     * 注册页提交
     */
    app.post('/reg', checkNotLogin);
    app.post('/reg', function(req, res){

      console.log(req.body);

      if(req.body["password"] != req.body["password-repeat"])
      {
        req.flash("error", "两次输入的密码不一致");
        return res.redirect('/reg');
      }

      // var md5 = crypto.createHash('md5');
      // var password = md5.update(req.body['password']).digest('base64');

      var newUser = new User({
        name: req.body.username,
        password: req.body.password
      });

      User.get(newUser.name, function(err, user){
        if(err){
          req.flash('error', err);
          return res.redirect('/');
        }
        if(user){
          req.flash('error', '用户已存在');
          return res.redirect('/reg');
        }
        newUser.save(function(err, user){
          if(err){
            req.flash('err',err);
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
    app.get('/login', function(req, res){
      res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
      });
    });
    /**
     * 登录页提交
     */
    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res){

      var name = req.body.username,
          password = req.body.password;

      User.get(name, function(err, user){
        if(err){

        }
        if(!user)
        {
          req.flash(error, '用户不存在');
          console.log('用户不存在');
          return res.redirect('/login');
        }
        if(user.password != password)
        {
          req.flash(error, '用户口令错误');
          console.log('用户口令错误');
          return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');

      });


      
    });
    /**
     * 离开页面
     */   
    app.get('/logout', checkLogin);
    app.get('/logout', function(req, res){
        req.session.user = null;
        req.flash('success', '登出成功');
        res.redirect('/');
    });


    function checkNotLogin(req, res, next){
      if(req.session.user)
      {
        req.flash('error', '已登入');
        console.log('已登入');
        return res.redirect('/');
      }
      next();
    }

    function checkLogin(req, res, next){
      if(!req.session.user)
      {
        req.flash('error', '未登入');
        console.log('未登入');
        return res.redirect('/login');
      }
      next();
    }

};
