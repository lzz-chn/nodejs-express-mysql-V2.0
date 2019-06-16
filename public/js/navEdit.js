let title = $('.box .title'),
    sub = $('.sub'),
    form = $('.navEdit'),
    pid = $('.pid');

getSelectData(pid, 0, '顶级导航');

// 使用正则取 edit 的数据
let editStatus = location.search.match(/\w+=\w+/g);
if (editStatus) {
    if (editStatus[0] == 'edit=add') {
        title.text('添加导航');
        sub.click(function() {
            $.ajax({
                url: '/admin/nav/navAdd',
                method: 'post',
                data: form.serialize(),
                success: function(data) {
                    switch (data) {
                        case 'insert succeed':
                            alert('导航添加成功');
                            location.href = '/admin/nav/';
                            break;
                        case 'navName repeat':
                            alert('导航名称已存在');
                            break;
                        default:
                            alert('导航添加出错');
                            break;
                    }
                }
            });
        });
    }
    if (editStatus[0] == 'edit=update') {
        let pid;
        title.text('更新导航');
        $.ajax({
            url: '/admin/nav/navGetDataById',
            data: { id: editStatus[1].match(/\d+/g)[0] },
            success: function(data) {
                $('.pid option').prop({
                    selected: function(i, v) {
                        // 遍历所有 option 将对应的的 option 修改为 true
                        if ($(this).val() == data.pid) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                pid = data.pid;
                $('.pid').prop({ disabled: true }); // 禁用复选框
                $('.navName').val(data.navName);
                $('.navTitle').val(data.navTitle);
                $('.navKeywords').val(data.navKeywords);
                $('.navDescription').val(data.navDescription);
                $('.navStatus').prop({
                    checked: function(i, v) {
                        if ($(this).val() == data.navStatus) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                $('.navSort').val(data.navSort);
            }
        });
        sub.click(function() {
            $.ajax({
                url: '/admin/nav/navUpdate',
                method: 'post',
                data: form.serialize().concat('&', editStatus[1], '&pid=', pid),
                success: function(data) {
                    switch (data) {
                        case 'set succeed':
                            alert('导航编辑成功');
                            location.href = '/admin/nav';
                            break;
                        case 'navName repeat':
                            alert('导航名称重复');
                            break;
                        default:
                            alert('导航编辑出错');
                            break;
                    }
                }
            });
        });
    }
}
