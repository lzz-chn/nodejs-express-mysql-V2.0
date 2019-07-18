var express = require('express');
var router = express.Router();
var path = require('path');
var upFile = require('filese'); // 文件管理模块
var upload = upFile('public/uploads/'); //上传文件的 文件目录
var corsz = require('corsz'); // 跨域模块
var request = require('request'); // 请求模块
var mysql = require('mysql'); // MySQL 数据库模块
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'mysql_1'
});
connection.connect();

corsz(router);

// 拼接绝对地址
const setPath = (req, paths) =>
    path.join(req.app.get('position'), 'public', paths);

// 将路径中的 \ 转换为 \\ 防止被系统转义
const repBackslash = str => str.replace(/\\/g, '\\\\');

// 图片地址拼接
const imgPath = (req, img) => path.join(req.app.get('position'), img);

// 上传图片文件
router.post('/imgUpload', upload.single('photos'), (req, res, next) => {
    console.log('imgUpload');
    if (req.file) {
        console.log('imgUpload success');
        res.send(req.file.rdestination);
    } else {
        console.log('imgUpload error');
        res.send('imgUpload error');
    }
});

// 微信登陆测试
router.post('/login', (req, res, next) => {
    //request("写请求地址",回调函数(错误，响应，数据))
    console.log('wechat login');
    var options = {
        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
    };
    request(options, function(error, response, body) {
        console.log(body); //body就是接受的数据
        req.session.weChatLogin = JSON.parse(body); // 数据存储到 session
        res.send(body);
    });
    
}) 

module.exports = router;
