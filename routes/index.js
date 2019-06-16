var express = require('express');
var router = express.Router();
var path = require('path');
var svgCaptcha = require('svg-captcha');
var navcm = require('navcm');
var nav = navcm();
var mysql = require('mysql');
var upFile = require('filese');
var upload = upFile('public/uploads/'); //上传文件的 文件目录

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'mysql_1'
});
connection.connect();

// 拼接绝对地址
const setPath = (req, paths) =>
    path.join(req.app.get('position'), 'public', paths);

// 将路径中的 \ 转换为 \\ 防止被系统转义
const repBackslash = str => str.replace(/\\/g, '\\\\');

// 图片地址拼接
const imgPath = (req, img) => path.join(req.app.get('position'), img);

// 公共路由 验证码
router.get('/captcha', function(req, res) {
    var captcha = svgCaptcha.create({
        // 创建验证码
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 4, // 干扰线条的数量
        color: true
    });
    req.session.captcha = captcha.text; // 验证码存储到 session

    res.type('svg'); // 验证码格式 svg
    res.status(200).send(captcha.data); // 响应状态码200，发送验证码
});

// 管理员登录
// router.get(['/admin', '/admin/*'], (req, res, next) => {
//     if (req.session.admin == undefined) {
//         res.redirect('/signIn');
//     }
//     next();
// });

router.get('/admin', (req, res, next) => {
    res.sendFile(setPath(req, '/admin.html'));
});

router.get('/signIn', (req, res, next) => {
    res.sendFile(setPath(req, 'signIn.html'));
});

router.get('/admin/nav', (req, res, next) => {
    res.sendFile(setPath(req, 'nav.html'));
});

router.get('/admin/nav/navEdit', (req, res, next) => {
    res.sendFile(setPath(req, 'navEdit.html'));
});

// 新增导航名称去重中间件
router.use(['/admin/nav/navAdd'], (req, res, next) => {
    let sql = ` select * from nav where 
                navName = '${req.body.navName}' and
                pid = '${req.body.pid}'`;

    connection.query(sql, (e, r, f) => {
        if (e) throw e;
        if (r.length > 0) {
            console.log('navName repeat');
            res.send('navName repeat');
        } else {
            next();
        }
    });
});

// 新增导航
router.post('/admin/nav/navAdd', (req, res, next) => {
    let sql = ` insert into nav set 
                navName = '${req.body.navName}',
                navTitle ='${req.body.navTitle}',
                navKeywords ='${req.body.navKeywords}',
                navDescription ='${req.body.navDescription}',
                navStatus ='${req.body.navStatus}',
                navSort ='${req.body.navSort}',
                pid = '${req.body.pid}'`;

    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        // console.log(results.affectedRows); // 当前操作数据的行数
        // console.log(results.insertId);  // 当前插入的 id 号
        console.log('insert succeed');
        res.send('insert succeed');
    });
});


router.get('/admin/nav/navSelect', (req, res, next) => {
    connection.query('select * from nav', (error, results, fields) => {
        if (error) throw error;
        //将数据通过 pid 分层级 并生成 option标签 带id表示查询对应id 的数据
        res.send(nav.get_hierarchy_select(results));
    });
});

router.get('/admin/nav/navList', (req, res, next) => {
    connection.query('select * from nav', (error, results, fields) => {
        if (error) throw error;
        res.send(nav.get_hierarchy_json(results)); // 以json 格式发送
    });
});

// 删除导航
router.get('/admin/nav/navDel', (req, res, next) => {
    let ids;

    connection.query(`select * from nav`, (e, r, f) => {
        if (e) throw e;
        // 获取 id 及以下的所有pid数据的id
        ids = nav.get_insertAll_id(r, req.query.id);
        connection.query(`delete from nav where id in(${ids})`, (e, r, f) => {
            if (e) throw e;
            // id 及以下的所有pid数据的id 的文章
            connection.query(
                `select * from article where pid in(${ids})`,
                (e, r, f) => {
                    if (e) throw e;
                    if (r.length > 0) {
                        r.forEach(function(v, i) {
                            if (v.img_path) {
                                upload.deleteFile(imgPath(req, v.img_path));
                            }
                        });
                        connection.query(
                            `delete from article where pid = ${v.id}`
                        );
                    }
                    console.log('delete succeed');
                    res.send(r);
                }
            );
        });
    });
});

// // 删除导航
// router.get('/admin/nav/navDel', (req, res, next) => {
//     let ids;

//     connection.query(`select * from nav`, (e, r, f) => {
//         if (e) throw e;
//         // 获取 id 及以下的所有pid数据的id
//         ids = nav.get_insertAll_id(r, req.query.id);
//         connection.query(`delete from nav where id in(${ids})`, (e, r, f) => {
//             if (e) throw e;
//             console.log('delete succeed');
//             res.send(r);
//         });
//     });
// });

// 读取 id 对应的相应数据
router.post('/admin/nav/navGetDataById', (req, res, next) => {
    connection.query(
        `select * from nav where id = ${req.body.id}`,
        (error, results, fields) => {
            if (error) throw error;
            console.log(results[0]);
            res.send(results[0]);
        }
    );
});

// 编辑导航名称去重中间件
router.use(['/admin/nav/navUpdate'], (req, res, next) => {
    let sql = ` select * from nav where id<>(${req.body.id}) and
                navName = '${req.body.navName}' and 
                pid = ${req.body.pid}`;
    // console.log(sql);
    // console.log(req.body);
    connection.query(sql, (e, r, f) => {
        if (e) throw e;
        if (r.length > 0) {
            console.log('navName repeat');
            res.send('navName repeat');
        } else {
            next();
        }
    });
});

// 编辑导航
router.post('/admin/nav/navUpdate', (req, res, next) => {
    console.log(req.body);
    let sql = ` update nav set 
    navName = '${req.body.navName}',
    navTitle ='${req.body.navTitle}',
    navKeywords ='${req.body.navKeywords}',
    navDescription ='${req.body.navDescription}',
    navStatus ='${req.body.navStatus}',
    navSort ='${req.body.navSort}'
    where id = ${req.body.id}`;

    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        console.log('set succeed');
        res.send('set succeed');
    });
});

// 文章管理
router.get('/admin/article', (req, res, next) => {
    res.sendFile(setPath(req, 'article.html'));
});

// 文章管理页面
router.get('/admin/article/articleEdit', (req, res, next) => {
    res.sendFile(setPath(req, 'articleEdit.html'));
});

// 上传图片文件
router.post('/admin/imgUpdate', upload.single('img'), (req, res, next) => {
    // console.log(req.file);
    if (req.file) {
        res.send(req.file.rdestination);
        // res.send(repBackslash(req.file.path));
    } else {
        res.end();
    }
    // 删除上传到服务器的文件，使用用户浏览器中缓存的文件
    setTimeout(() => {
        upload.deleteFile(imgPath(req, req.file.path));
    }, 2000);
});

// 新增文章
router.post(
    '/admin/article/articleAdd',
    upload.single('img'),
    (req, res, next) => {
        let sql = `insert into article set 
               title = '${req.body.title}',
               author = '${req.body.author}',
               status = '${req.body.status}',
               classType = '${req.body.classType}',
               source = '${req.body.source}',
               keywords = '${req.body.keywords}',
               description = '${req.body.description}',
               content = '${req.body.content}',
               tag = '${req.body.tag}',
               img = '${req.file ? req.file.rdestination : null}',
               img_path = '${req.file ? repBackslash(req.file.path) : null}',
               pid = '${req.body.pid}'`;

        let sqlRepeat = ` select * from article where 
               title = '${req.body.title}' and 
               author = '${req.body.author}'`;

        // 文章去重
        connection.query(sqlRepeat, (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                console.log('article repeat');
                res.send('article repeat');
            } else {
                // 文章添加
                connection.query(sql, (error, results, fields) => {
                    if (error) throw error;
                    if (results) {
                        console.log(sql);
                        console.log('articleAdd succeed');
                        res.send('articleAdd succeed');
                    }
                });
            }
        });
    }
);

var mpages = require('mpages');

// 文章列表路由
// 可通过搜索文章标题来查询，可以用栏目分类查询，可以用文章类型
router.get('/admin/article/articleGet', (req, res, next) => {
    req.query.page = req.query.page ? req.query.page : 1;
    console.log(req.query);
    switch (req.query.select) {
        case 'all':
            mpages.getPaging(
                connection,
                'select * from article',
                5, // pagesize 一页多少数据
                5, // pageBtnNum 页码按钮的最大数
                req.query.page, // pageBtnCount 当前页码
                function(data) {
                    res.send(data);
                }
            );
            console.log('select all');
            break;
        case 'title':
            mpages.getPaging(
                connection,
                `select * from article where title like '%${req.query.value}%'`,
                5,
                5,
                req.query.page,
                function(data) {
                    res.send(data);
                }
            );
            console.log('select title');
            break;
        case 'pid':
            mpages.getPaging(
                connection,
                `select * from article title where pid ='${req.query.value}'`,
                5,
                5,
                req.query.page,
                function(data) {
                    res.send(data);
                }
            );
            console.log('select pid');
            break;
        case 'classType':
            mpages.getPaging(
                connection,
                `select * from article title where classType = '${
                    req.query.value
                }'`,
                5,
                5,
                req.query.page,
                function(data) {
                    res.send(data);
                }
            );
            console.log('select classType');
            break;

        default:
            console.log('unsupported ways');
            res.send('unsupported ways');
            break;
    }
});

// 删除文章
router.get('/admin/article/articleDel', (req, res, next) => {
    console.log(req.query.img_path);
    connection.query(
        `delete from article where id = ${req.query.id}`,
        (error, results, fields) => {
            if (error) throw error;
            if (results) {
                if (req.query.img_path) {
                    upload.deleteFile(imgPath(req, req.query.img_path));
                }
                console.log('articleDel succeed');
                res.send('articleDel succeed');
            } else {
                res.send();
            }
        }
    );
});

// 读文章数据
router.get('/admin/article/articleReadData', (req, res, next) => {
    let sql = `select * from article where id = ${req.query.id}`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        if (results) {
            res.send(results[0]);
        } else {
            console.log('no data');
            res.send('no data');
        }
    });
});

// 更新文章数据
router.post(
    '/admin/article/articleUpdate',
    upload.single('img'),
    (req, res, next) => {
        let sqlRepeat = `   select * from article where 
                        id<>(${req.body.id}) and 
                        title = '${req.body.title}' and 
                        author = '${req.body.author}'`;

        let sql = ` update article set 
                title = '${req.body.title}',
                author = '${req.body.author}',
                status = '${req.body.status}',
                classType = '${req.body.classType}',
                source = '${req.body.source}',
                keywords = '${req.body.keywords}',
                description = '${req.body.description}',
                content = '${req.body.content}',
                tag = '${req.body.tag}',
                img = '${
                    req.body.classType == 0
                        ? ''
                        : req.file
                        ? req.file.rdestination
                        : req.body.imgOld
                }',
                img_path = '${
                    req.body.classType == 0
                        ? ''
                        : req.file
                        ? repBackslash(req.file.path)
                        : repBackslash(req.body.imgOld_path)
                }', 
                pid = '${req.body.pid}' 
                where id = ${req.body.id}`;

        // 文章去重
        connection.query(sqlRepeat, (error, results, fields) => {
            if (error) throw error;
            if (req.file || req.body.classType == 0) {
                // 存在文件上传 或 类型为文本类型就删除图片
                if (req.body.imgOld_path) {
                    upload.deleteFile(
                        imgPath(req, repBackslash(req.body.imgOld_path))
                    );
                }
            }
            if (results.length > 0) {
                console.log('article repeat');
                res.send('article repeat');
            } else {
                // 文章添加
                connection.query(sql, (error, results, fields) => {
                    if (error) throw error;
                    if (results) {
                        console.log('articleUpdate succeed');
                        res.send('articleUpdate succeed');
                    }
                });
            }
        });
    }
);

// 网站设置页面
router.get('/admin/website', (req, res, next) => {
    res.sendFile(setPath(req, 'website.html'));
});

// 查询网站基本信息
router.get('/admin/website/websiteGet', (req, res, next) => {
    connection.query(`select * from website`, (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            console.log('old ' + results[0].id);
            res.send(results[0]);
        } else {
            // 无数据，添加一条默认数据，防止报错
            let sql = ` insert into website set 
                        title = ''`;
            connection.query(sql, (error, results, fields) => {
                if (error) throw error;
                console.log('new ' + results.insertId);
                res.send(`${results.insertId}`); // 以 string 类型发送 ID号
            });
        }
    });
});

// 网站基本信息更新
router.post(
    '/admin/website/websiteUpdate',
    upload.fields([
        { name: 'logo_pc', maxCount: 1 },
        { name: 'logo_mobile', maxCount: 1 }
    ]),
    (req, res, next) => {
        let sql = `update website set 
        title = '${req.body.title}' ,
        keywords = '${req.body.keywords}' ,
        description = '${req.body.description}' ,
        email = '${req.body.email}' ,
        phone = '${req.body.phone}' ,
        address = '${req.body.address}' ,
        qq = '${req.body.qq}' ,
        wechat = '${req.body.wechat}' ,
        icps = '${req.body.icps}' , 
        logo_pc = '${
            req.files.logo_pc
                ? repBackslash(req.files.logo_pc[0].path)
                : req.body.old_logo_pc
        }' , 
        logo_mobile = '${
            req.files.logo_mobile
                ? repBackslash(req.files.logo_mobile[0].path)
                : req.body.old_logo_mobile
        }' 
        where id = '${req.body.id}'`;

        if (req.files.logo_pc && req.body.old_logo_pc) {
            upload.deleteFile(imgPath(req, repBackslash(req.body.old_logo_pc)));
        }
        if (req.files.logo_mobile && req.body.old_logo_mobile) {
            upload.deleteFile(
                imgPath(req, repBackslash(req.body.old_logo_mobile))
            );
        }
        console.log(sql);
        console.log(req.body);
        connection.query(sql, (error, results, fields) => {
            if (error) throw error;
            if (results) {
                console.log('websiteUpdate succeed');
                res.send('websiteUpdate succeed');
            }
        });
    }
);

var qr = require('qr-image');
router.get('/qr', function(req, res) {
    var qr_svg = qr.image(req.query.txt, { type: 'png', size: 10, margin: 2 });
    res.type('image/png');
    qr_svg.pipe(res);
});

module.exports = router;
