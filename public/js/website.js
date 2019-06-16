let id,
    imgOld = { logo_pc: '', logo_mobile: '' };

// 显示已有数据
(() => {
    $.ajax({
        url: '/admin/website/websiteGet',
        async: false,
        success: function(data) {
            if (typeof data == 'string') {
                id = data;
                // console.log('insertId : ' + id);
            } else {
                id = data.id;
                // console.log('data : ' + id);
                imgOld.logo_pc = data.logo_pc ? repBackslash(data.logo_pc) : null;
                imgOld.logo_mobile = data.logo_mobile ? repBackslash(data.logo_mobile) : null;
                $('.title').val(data.title);
                $('.keywords').val(data.keywords);
                $('.description').val(data.description);
                $('.logoPc').attr({
                    src: `/${
                        data.logo_pc
                            ? data.logo_pc.replace('public\\', '')
                            : 'img/pictures_update.png'
                    }`
                });
                $('.logoMobile').attr({
                    src: `/${
                        data.logo_mobile
                            ? data.logo_mobile.replace('public\\', '')
                            : 'img/pictures_update.png'
                    }`
                });
                $('.email').val(data.email);
                $('.phone').val(data.phone);
                $('.address').val(data.address);
                $('.qq').val(data.qq);
                $('.wechat').val(data.wechat);
                $('.icps').val(data.icps);
            }
        }
    });
})();
const imgUpload = (inp, img, fileSize) => {
    img.click(function() {
        inp.click();
    });
    inp.change(function() {
        if (this.files[0].name.match(/\.(png|jpg|jpeg|gif|bmp)$/)) {
            // logo文件大小超过 fileSizeKB 不允许上传
            if (this.files[0].size / 1024 <= fileSize) {
                let imgFile = new FormData();
                imgFile.append('img', this.files[0]);

                $.ajax({
                    url: '/admin/imgUpdate',
                    method: 'post',
                    data: imgFile,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        if (data) {
                            img.attr({ src: `/${data}` });
                            alert('上传图片成功');
                        } else {
                            alert('上传图片失败');
                        }
                    }
                });
            } else {
                alert(`上传图片大小不允许超过${fileSize}KByte`);
            }
        } else {
            alert('上传格式错误');
        }
    });
};
imgUpload($('.logo_pc'), $('.logoPc'), 400);
imgUpload($('.logo_mobile'), $('.logoMobile'), 200);

$('.sub').click(function() {
    let f = new FormData();
    f.append('id', id);
    f.append('title', $('.title').val());
    f.append('keywords', $('.keywords').val());
    f.append('description', $('.description').val());
    f.append('email', $('.email').val());
    f.append('phone', $('.phone').val());
    f.append('address', $('.address').val());
    f.append('qq', $('.qq').val());
    f.append('wechat', $('.wechat').val());
    f.append('icps', $('.icps').val());
    f.append('logo_pc', $('.logo_pc')[0].files[0]);
    f.append('logo_mobile', $('.logo_mobile')[0].files[0]);
    f.append('old_logo_pc', imgOld.logo_pc);
    f.append('old_logo_mobile', imgOld.logo_mobile);

    $.ajax({
        url: '/admin/website/websiteUpdate',
        method: 'post',
        processData: false,
        contentType: false,
        data: f,
        success: function(data) {
            if (data == 'websiteUpdate succeed') {
                alert('更新成功');
                location.href = '/admin/website';
            }
        }
    });
});
