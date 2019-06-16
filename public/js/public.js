/**
 * 获取所属栏目复选框中的数据并添加进复选框
 * select: 选择器
 * text: 默认显示的文本
 */
const getSelectData = (select, text) => {
    $.ajax({
        url: '/admin/nav/navSelect?type=option',
        async: false,
        success: function(data) {
            select.html(`<option value="0">${text}</option>${data}`);
        }
    });
};
