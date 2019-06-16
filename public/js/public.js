/**
 * 获取所属栏目复选框中的数据并添加进复选框
 * select: 选择器
 * value: option标签value属性默认值
 * text: 默认显示的文本
 */
const getSelectData = (select, value, text) => {
    $.ajax({
        url: '/admin/nav/navSelect?type=option',
        async: false,
        success: function(data) {
            select.html(`<option value="${value}">${text}</option>${data}`);
        }
    });
};

/**
 * 将路径中的 \ 转换为 \\ 防止被系统转义
 * @param {*} str 
 */
const repBackslash = str => str.replace(/\\/g, '\\\\');