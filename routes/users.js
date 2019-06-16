var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'mysql_1'
});
connection.connect();

router.get('/signIn', (req, res) => {
    console.log('query: '+req.query.captcha);
    console.log('session: '+req.session.captcha);
    if (req.query.captcha == req.session.captcha) {
        connection.query(
            `select * from users where userName='${req.query.name}' and userPassword='${
                req.query.pwd
            }'`,
            (error, results, fields) => {
                if (error) throw error;
                if (results.length == 1) {
                    console.log('登录成功');
                    req.session.admin = results[0];
                } else {
                    console.log('登录失败');
                }
                res.send(results);
            }
        );
    } else {
        console.log('验证码错误');
        res.send('captcha error');
    }
});

router.get('/getAdmin', (req, res) => {
    console.log('getAdmin succeed');
    res.send(req.session.admin);
});

router.get('/delAdmin', (req, res) => {
    req.session.admin = undefined;
    console.log('delAdmin succeed');
    res.send('delAdmin succeed');
});

module.exports = router;
