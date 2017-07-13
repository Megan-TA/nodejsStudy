var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* -----------------------------test start------------------------------------ */
/**
 * test page
 */
router.get('/test', function(req, res, next) {
  res.render('test',  { title: 'I am from test Page!' });
  next();
});
/**
 * test page的子页面
 */
router.get('/test/:test', function(req, res, next) {
  res.render('test',  { title: 'My parent is test page~~' });
});
/**
 * 默认router不会匹配同一个规则,只会先取匹配到的第一个规则
 * 若想调用多个同一规则 需要调用next()来进行控制权转移
 */
router.get('/test', function(req, res, next) {
  console.log('--------------');
  console.log(req.param);
  console.log('--------------');
});
/**
 * 测试 验证二级路径名称验证
 */
var users = {
  'search': {
    name: 'Carbo',
    webSite: 'http://www.baidu.com'
  }
};

router.all('/user/:username', function(req, res, next){
  //  检查用户是否存在
  if(users[req.params.username])
  {
    next();
  }else{
    console.log(users);
    next(new Error( req.params.username + ' does not exist.' ));
  }

});

router.get('/user/:username', function(req, res){
  // 用户一定存在 直接展示
  res.send(JSON.stringify(users[req.params.username]));
});
/* -----------------------------test end------------------------------------ */

/**
 * 
 */
router.get('/u/:user', function(req, res){

});
/**
 * 
 */
router.post('/post', function(req, res){

});
/**
 * 
 */
router.get('/reg', function(req, res){

});
/**
 * 
 */
router.post('/reg', function(req, res){

});
/**
 * 登录
 */
router.get('/login', function(req, res){

});
/**
 * 登录提交
 */
router.post('/login', function(req, res){

});
/**
 * 登出
 */
router.get('/logout', function(req, res){

});
/**
 * 登出提交
 */
router.post('/logout', function(req, res){

});








module.exports = router;
