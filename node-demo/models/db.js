/**
* mongodb 配置
* @authors chen_huang (chen_huang@ctrip.com)
* @date 17-07-27
* @version 1.0
*/

var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db( settings.db, new Server(settings.host, settings.port, {safe: true}));