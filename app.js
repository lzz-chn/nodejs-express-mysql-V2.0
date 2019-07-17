var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // session 存储
var bodyParser = require('body-parser');
var ueditor = require('ueditor');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var wxmpRouter = require('./routes/wxmp');

var app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());
// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
app.use(
    '/ueditor/ue',
    ueditor(path.join(__dirname, 'public'), function(req, res, next) {
        var imgDir = '/uploads/'; // 默认上传地址
        var ActionType = req.query.action;

        if (
            ActionType === 'uploadimage' ||
            ActionType === 'uploadfile' ||
            ActionType === 'uploadvideo'
        ) {
            var file_url = imgDir; //默认上传地址为图片
            /*其他上传格式的地址*/
            if (ActionType === 'uploadfile') {
                file_url = '/file/ueditor/'; //附件保存地址
            }
            if (ActionType === 'uploadvideo') {
                file_url = '/video/ueditor/'; //视频保存地址
            }
            res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
            res.setHeader('Content-Type', 'text/html');
        }
        //客户端发起图片列表请求
        else if (ActionType === 'listimage') {
            res.ue_list(imgDir); // 客户端会列出 dir_url 目录下的所有图片
        }
        // 客户端发起其它请求
        else {
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/ueditor/ueditor.config.json');
        }
    })
);

// 拦截 admin及全部子集的.html文件直接访问 中间件
app.use((req, res, next) => {
    if (req.originalUrl.match(/admin(\/\w)*.html/)) {
        res.send('非法访问');
    } else {
        next();
    }
});

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 5 } // 过期时间 5分钟
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'tools')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wxmp', wxmpRouter);

app.set('position', __dirname); // 共同变量

module.exports = app;
