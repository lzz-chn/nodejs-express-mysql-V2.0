// 初始化 ueditor 插件
let ue = UE.getEditor('container', {
    initialFrameWidth: 900,
    initialFrameHeight: 300,
    autoClearEmptyNode: false
});

let titles = $('.titles'),
    pid = $('.pid'),
    classType = $('.classType'),
    upImg = $('.upImg'),
    sub = $('.sub'),
    form = $('.articleEdit'),
    img = $('.img'),
    imgSub = $('.imgSub'),
    imgUpdate = $('.imgUpdate');

getSelectData(pid, -1, '未分类');

let editStatus = location.search.match(/\w+=\w+/g);
if (editStatus) {
    console.log(editStatus);
    if (editStatus[0] == 'edit=add') {
        titles.text('添加文章');
        sub.click(function() {
            var f = new FormData();
            f.append('title', $('.title').val());
            f.append('author', $('.author').val());
            f.append('status', $('.status:checked').val());
            f.append('classType', $('.classType').val());
            f.append('source', $('.source').val());
            f.append('keywords', $('.keywords').val());
            f.append('description', $('.description').val());
            f.append('content', ue.getContent());
            f.append('tag', $('.tag').val());
            f.append('pid', $('.pid').val());
            f.append('img', img[0].files[0]);

            $.ajax({
                url: '/admin/article/articleAdd',
                method: 'post',
                data: f,
                processData: false,
                contentType: false,
                success: function(data) {
                    switch (data) {
                        case 'articleAdd succeed':
                            alert('文章添加成功');
                            location.href = '/admin/article';
                            break;
                        case 'article repeat':
                            alert('文章名称已存在');
                            break;
                        default:
                            alert('文章添加出错');
                            break;
                    }
                }
            });
        });
    }
    if (editStatus[0] == 'edit=update') {
        titles.text('更新文章');
        if (editStatus[1]) {
            let imgOld = {}; // 图片地址缓存
            $.ajax({
                url: '/admin/article/articleReadData',
                data: editStatus[1],
                success: function(data) {
                    console.log(data);
                    $('.title').val(data.title);
                    $('.author').val(data.author);
                    $('.status').prop({
                        checked: function() {
                            if ($(this).val() == data.status) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                    $('.pid option').prop({
                        selected: function() {
                            return $(this).val() == data.pid ? true : false;
                        }
                    });
                    $('.classType option').prop({
                        selected: function() {
                            return $(this).val() == data.classType ? true : false;
                        }
                    });
                    $('.source').val(data.source);
                    $('.keywords').val(data.keywords);
                    $('.description').val(data.description);
                    $('.tag').val(data.tag);
                    ue.ready(function() {
                        ue.setContent(data.content);
                    });
                    if (data.classType > 0) {
                        $('.upImg').slideDown();
                        $('.imgUpdate').attr({ src: '/' + data.img });
                    }
                    imgOld = { img: data.img, img_path: data.img_path }; // 图片地址缓存
                }
            });
            sub.click(function() {
                var f = new FormData();
                f.append('id', editStatus[1].match(/\d+/g));
                f.append('title', $('.title').val());
                f.append('author', $('.author').val());
                f.append('status', $('.status:checked').val());
                f.append('classType', $('.classType').val());
                f.append('source', $('.source').val());
                f.append('keywords', $('.keywords').val());
                f.append('description', $('.description').val());
                f.append('content', ue.getContent());
                f.append('tag', $('.tag').val());
                f.append('pid', $('.pid').val());
                f.append('imgOld', imgOld.img);
                f.append('imgOld_path', imgOld.img_path);
                f.append('img', img[0].files[0]);
                $.ajax({
                    url: '/admin/article/articleUpdate',
                    method: 'post',
                    async: false,
                    data: f,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        switch (data) {
                            case 'articleUpdate succeed':
                                alert('文章更新成功');
                                location.href = '/admin/article';
                                break;
                            case 'article repeat':
                                alert('文章名称已存在');
                                break;
                            default:
                                alert('文章更新出错');
                                break;
                        }
                    }
                });
            });
        }
    }
}

// 展开收缩上传图片选项
classType.change(function() {
    if (this.value != 0) {
        upImg.slideDown();
    } else {
        upImg.slideUp();
    }
});

imgUpdate.click(function() {
    img.click();
});
img.change(function() {
    if (this.files[0].type.search(/image\/(png|jpg|jpeg|gif|bmp)$/) != -1) {
        let f = new FormData();
        f.append('img', this.files[0]);
        $.ajax({
            url: '/admin/imgUpdate',
            method: 'post',
            data: f,
            // 发送时不转换发送文件的格式，默认转换为string
            processData: false,
            // 根据文件类型选择编码类型不使用默认值
            // 默认编码类型为application/x-www-form-urlencoded
            // 文件上传使用的是multipart/form-data
            contentType: false,
            success: function(data) {
                if (data) {
                    imgUpdate.attr({ src: '/' + data });
                } else {
                    alert('上传出错');
                }
            }
        });
    } else {
        alert('上传格式错误');
    }
});
