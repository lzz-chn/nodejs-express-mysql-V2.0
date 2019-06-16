'use strict';

let listA = $('.sidebar .list li>a'),
    listAA = $('.sidebar .list li dl>a'),
    listDl = $('.sidebar .list li dl'),
    btnSidebar = $('.main .header .left i:nth-of-type(1)'),
    btnReload = $('.main .header .left i:nth-of-type(2)'),
    btnTheme = $('.main .header .right i:nth-of-type(1)'),
    btnArrows = $('.main .header .right i:nth-of-type(2)'),
    btnAbout = $('.main .header .right i:nth-of-type(3)'),
    btnUser = $('.main .header .right span'),
    sidebar = $('.sidebar'),
    mainHeader = $('.main .header'),
    theme = $('.main .admin .theme>div'),
    about = $('.main .admin .about'),
    user = $('.main .admin .userBox'),
    userSignOut = $('.main .admin .userBox div'),
    logo = $('.sidebar .logo a'),
    main = $('.main'),
    sidebarW = sidebar.width(),
    temp = [],
    line = $('.sidebar .list .line');

// 修改默认的用户名称
$.ajax({
    url: '/users/getAdmin',
    success: function(data) {
        btnUser.text(data.userName);
    }
});

listA.click(function() {
    $(this)
        .children('i:last-of-type')
        .toggleClass('fa-caret-down fa-caret-up');

    $(this)
        .siblings()
        .toggle();
    listDl.not($(this).siblings()).hide();
});
listA.mouseover(function() {
    line.show().animate({ top: $(this).position().top }, 200);
});
listA.mouseout(function() {
    line.hide();
});
listAA.click(function() {
    $(this)
        .children('i:last-of-type')
        .toggleClass('fa-caret-down fa-caret-up');
    $(this)
        .siblings()
        .toggle();
    // listDl.not($(this).siblings()).hide();
});
btnSidebar.click(function() {
    $(this).toggleClass('fa-outdent fa-indent');
    if ($(this).hasClass('fa-indent')) {
        $(this).attr('title', '展开侧边栏');
        sidebar.animate({ width: '55px' });
        main.animate({ paddingLeft: '55px' });
        listA
            .children()
            .not('i')
            .hide();
        listDl
            .each(function(i, v) {
                temp[i] = $(v).attr('style');
            })
            .hide();
        logo.children().toggle();
    } else {
        $(this).attr('title', '收起侧边栏');
        sidebar.animate({ width: sidebarW + 'px' });
        main.animate({ paddingLeft: sidebarW + 'px' });
        listA
            .children()
            .stop()
            .delay(200)
            .queue(function() {
                $(this).show();
            });
        listDl.each(function(i, v) {
            $(this).attr('style', temp[i]);
        });
        logo.children()
            .stop()
            .delay(200)
            .queue(function() {
                $(this).toggle();
            });
    }
});

btnArrows.click(function() {
    $(this).toggleClass('fa-compress-arrows-alt fa-expand-arrows-alt');
    if ($(this).hasClass('fa-compress-arrows-alt')) {
        $(this).attr('title', '退出全屏');
        screen('full');
    } else {
        $(this).attr('title', '全屏');
        screen('cancel');
    }
});
btnReload.click(function() {
    $('.main .admin iframe')[0].contentWindow.location.reload(true);
});
btnTheme.click(function() {
    theme.parent().toggleClass('themeDisplay');

    if (about.hasClass('themeDisplay')) {
        theme
            .stop()
            .delay(300)
            .queue(function() {
                $(this).toggleClass('themeDiv');
            });
    } else {
        theme.toggleClass('themeDiv');
    }
});
theme.click(function() {
    sidebar.css({
        backgroundColor: $(this)
            .children('div')
            .css('backgroundColor')
    });
    mainHeader.css({
        backgroundColor: $(this)
            .children('p')
            .css('backgroundColor')
    });
});
btnAbout.click(function() {
    about.toggleClass('themeDisplay');
    if (about.hasClass('themeDisplay')) {
        about
            .children()
            .stop()
            .delay(300)
            .queue(function() {
                $(this).show();
            });
    } else {
        about.children().hide();
    }
});
btnUser.click(function() {
    user.slideToggle();
});
userSignOut.click(function() {
    $.ajax({
        url: 'users/delAdmin',
        success: function(data) {
            if (data) {
                location.href = '/signIn';  // 跳转页面
            }
        }
    });
});

/**
 * @description screenFull and cancelScreenFull
 * @param {string} value  full or cancel
 * @returns succeed or error
 */

function screen(value) {
    if (value === 'full') {
        let el = document.documentElement; // 选中html标签
        //2.检测支持什么全屏的方法
        let rfs =
            el.requestFullScreen ||
            el.webkitRequestFullScreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;
        //3.检测当前rfs 里面是否 有函数，如果有函数就说明支持全屏，如果没有就是undefined
        //就说明上面的方法都不支持
        if (typeof rfs != 'undefined' && rfs) {
            rfs.call(el); //如果支持 就调用全屏方法
        }
        return 'succeed';
    }
    if (value === 'cancel') {
        let el = document; // 选中html标签
        let cfs =
            el.exitFullscree ||
            el.webkitCancelFullScreen ||
            el.mozCancelFullScreen ||
            el.msExitFullscreen;

        if (typeof cfs != 'undefined' && cfs) {
            cfs.call(el);
        }
        return 'succeed';
    }
    return 'error';
}
