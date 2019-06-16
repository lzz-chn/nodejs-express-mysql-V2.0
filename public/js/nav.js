let box = $('.box'),
    navLi = $('.box .nav li');

$.ajax({
    url: '/admin/nav/navSelect?type=json',
    success: function(data) {
        console.log(data);
        $.each(data, (k, v) => {
            box.append(
                `<tr>
                <td>${v.id}</td>
                <td>${v.limit + v.navName}</td>
                <td>${v.navTitle}</td>
                <td>${v.navKeywords}</td>
                <td>${v.navDescription}</td>
                <td>${v.navStatus == 0 ? '隐藏' : '显示'}</td>
                <td>${v.navSort}</td>
                <td>${v.pid}</td>
                <td> 
                    <a href="/admin/nav/navEdit?edit=update&id=${v.id}">
                        编辑
                    </a>
                    <button class="delBtn" id="${v.id}">
                        删除
                    </button>
                </td>
            </tr>`
            )
                .find('button:last')
                .click(function() {
                    $.ajax({
                        url: '/admin/nav/navDel',
                        data: { id: this.id },
                        success: function(data) {
                            if (data == 'delete succeed') {
                                alert(`删除成功`);
                                location.href = '/admin/nav/';
                            } else {
                                alert('删除失败');
                            }
                        }
                    });
                });
        });
    }
});
