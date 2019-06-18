let searchBtn = $('.search button'),
    searchInp = $('.search input'),
    pid = $('.pid'),
    classType = $('.classType'),
    boxTbody = $('.box tbody'),
    boxBtn = $('.boxBtn'),
    searchType = { select: 'all', value: '', page: 1 }, // 默认搜索类型为 all 空 1
    delBtn = $('.delBtn');

getSelectData(pid, -1, '未分类');

const appendTag = (data, tag) => {
    for (let i in data) {
        $.each($(data[i]), (k, v) => {
            tag.append(
                `<tr>
                <td>${v.id}</td>
                <td class="title">${v.title}</td>
                <td>${v.author}</td>
                <td>${v.navStatus == '0' ? '草稿' : '发布'}</td>
                <td>
                    ${['普通文章', '缩略图文章', '广告位文章'][v.classType]}
                </td>
                <td>
                    ${v.img != 'null' ? '<img src=/' + v.img + '>' : '无'}
                </td>
                <td>${v.readNum}</td>
                <td>${new Date(v.time).toLocaleDateString()}</td>
                <td>
                    <a href="/admin/article/articleEdit?edit=update&id=${v.id}">
                        编辑
                    </a>
                    <button class="delBtn" id="${v.id}" img_path="${
                    v.img_path
                }">
                        删除
                    </button>
                </td>
            </tr>`
            )
                .find('button:last')
                .click(function() {
                    $.ajax({
                        url: '/admin/article/articleDel',
                        method: 'post',
                        data: {
                            id: $(this).attr('id'),
                            img_path: $(this).attr('img_path')
                        },
                        success: function(data) {
                            if (data == 'articleDel succeed') {
                                alert('文章删除成功');
                                location.href = '/admin/article';
                            } else {
                                alert('文章删除失败');
                            }
                        }
                    });
                });
        });
    }
};

const select = datas => {
    console.log(datas);
    $.ajax({
        url: `/admin/article/articleGet`,
        data: datas,
        success: function(data) {
            // console.log(data);
            boxTbody.html(''); // 清空列表
            console.log(data.sqlData);
            if (data.sqlData) {
                appendTag(data.sqlData, boxTbody);
                boxBtn.html(''); // 清空按钮
                let pages = data.pagings.pageList;
                for (let i in pages) {
                    boxBtn.append(
                        $(`<button>${pages[i]}</button>`)
                            .click(function() {
                                searchType.page = pages[i];
                                select(searchType);
                            })
                            .css({
                                backgroundColor:
                                    pages[i] == data.pagings.page
                                        ? 'red'
                                        : 'green'
                            })
                    );
                }
            } else {
                boxTbody.append(`<td colspan="9">无数据</td>`);
            }
        }
    });
};
select(searchType);

searchBtn.click(function() {
    searchType.select = 'title';
    searchType.value = searchInp.val();
    select(searchType);
});

pid.change(function() {
    searchType.select = $(this).val() == -1 ? 'all' : 'pid';
    searchType.value = $(this).val();
    select(searchType);
});

classType.change(function() {
    searchType.select = 'classType';
    searchType.value = $(this).val();
    select(searchType);
});
